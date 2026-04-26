import csv
import re
from datetime import datetime, timezone
from io import StringIO

try:
    import bleach
except Exception:  # noqa: BLE001
    import html

    class bleach:
        @staticmethod
        def clean(value, strip=True):
            return html.escape(value or '')


CSV_HEADER_ALIASES = {
    'date': (
        'date',
        'review_date',
        'created_at',
        'created',
        'submitted_at',
        'submitted',
        'timestamp',
        'time',
        'at',
        'published_at',
        'publish_time',
    ),
    'rating': (
        'rating (1-5)',
        'rating',
        'overall rating',
        'overall',
        'rate',
        'score',
        'star rating',
        'stars',
        'star_rating',
        'review_rating',
        'review_score',
    ),
    'review_text': (
        'client comment',
        'review_text',
        'review',
        'review text',
        'review_body',
        'comment',
        'comments',
        'feedback',
        'text',
        'response',
        'content',
        'message',
    ),
}


def _max_reviews_for_access_type(access_type, free_plan_max_reviews, onetime_max_reviews, max_csv_rows):
    if access_type == 'trial':
        return free_plan_max_reviews
    if access_type == 'onetime':
        return onetime_max_reviews
    return max_csv_rows


def _normalize_csv_header(value):
    normalized = (value or '').lstrip('\ufeff').strip().lower()
    normalized = re.sub(r'[\(\)\[\]\{\}\-_/]+', ' ', normalized)
    normalized = re.sub(r'[^a-z0-9\s]+', ' ', normalized)
    normalized = re.sub(r'\s+', ' ', normalized).strip()
    return normalized


def _resolve_csv_column_mapping(fieldnames):
    headers = []
    for index, name in enumerate(fieldnames or []):
        normalized = _normalize_csv_header(name)
        if normalized:
            headers.append({'index': index, 'original': name, 'normalized': normalized})

    mapping = {}
    ambiguous = {}
    attempted_synonyms = {
        canonical: sorted({_normalize_csv_header(alias) for alias in aliases if _normalize_csv_header(alias)})
        for canonical, aliases in CSV_HEADER_ALIASES.items()
    }

    loose_tokens = {
        'rating': ('rating', 'rate', 'star', 'stars', 'overall'),
        'review_text': ('comment', 'comments', 'review', 'feedback', 'text', 'response'),
        'date': ('date', 'time', 'timestamp', 'created', 'submitted', 'published'),
    }

    def _contains_score(normalized_header, canonical):
        tokens = loose_tokens.get(canonical, ())
        if not tokens:
            return 0
        matched = [token for token in tokens if token in normalized_header]
        if not matched:
            return 0
        return len(set(matched))

    for canonical, aliases in CSV_HEADER_ALIASES.items():
        alias_set = {_normalize_csv_header(alias) for alias in aliases if _normalize_csv_header(alias)}

        exact_candidates = [header for header in headers if header['normalized'] in alias_set]
        if len(exact_candidates) == 1:
            mapping[canonical] = exact_candidates[0]['original']
            continue
        if len(exact_candidates) > 1:
            canonical_norm = _normalize_csv_header(canonical)
            canonical_exact = [header for header in exact_candidates if header['normalized'] == canonical_norm]
            if len(canonical_exact) == 1:
                mapping[canonical] = canonical_exact[0]['original']
                continue
            ambiguous[canonical] = [header['original'] for header in exact_candidates]
            continue

        scored_contains = []
        for header in headers:
            score = _contains_score(header['normalized'], canonical)
            if score > 0:
                scored_contains.append((score, header))
        if not scored_contains:
            continue
        scored_contains.sort(key=lambda row: (-row[0], row[1]['index']))
        best_score = scored_contains[0][0]
        best = [header for score, header in scored_contains if score == best_score]
        if len(best) == 1:
            mapping[canonical] = best[0]['original']
        else:
            ambiguous[canonical] = [header['original'] for header in best]

    missing_required = [key for key in ('rating', 'review_text') if key not in mapping]
    diagnostics = {
        'normalized_headers': [header['normalized'] for header in headers],
        'attempted_synonyms': attempted_synonyms,
        'ambiguous': ambiguous,
    }
    return mapping, missing_required, diagnostics


def _normalize_review_date(date_raw):
    value = str(date_raw or '').strip()
    if not value:
        return datetime.now(timezone.utc).date().isoformat()

    value = value.replace('Z', '+00:00')
    try:
        parsed = datetime.fromisoformat(value)
        return parsed.date().isoformat()
    except ValueError:
        pass

    for fmt in (
        '%Y-%m-%d',
        '%m/%d/%Y',
        '%d/%m/%Y',
        '%Y/%m/%d',
        '%m-%d-%Y',
        '%d-%m-%Y',
        '%m/%d/%y',
        '%d/%m/%y',
    ):
        try:
            parsed = datetime.strptime(value, fmt)
            return parsed.date().isoformat()
        except ValueError:
            continue

    iso_match = re.search(r'(\d{4}-\d{2}-\d{2})', value)
    if iso_match:
        return iso_match.group(1)

    return datetime.now(timezone.utc).date().isoformat()


def _parse_rating_value(raw_rating):
    value = str(raw_rating or '').strip()
    if not value:
        return None

    match = re.search(r'(\d+(?:\.\d+)?)', value)
    if not match:
        return None

    try:
        numeric = float(match.group(1))
    except ValueError:
        return None

    lower_value = value.lower()
    if numeric > 5 and numeric <= 10 and ('/10' in lower_value or 'out of 10' in lower_value):
        numeric = numeric / 2.0
    if numeric > 5 and numeric <= 100 and '%' in lower_value:
        numeric = (numeric / 100.0) * 5.0

    rating = int(round(numeric))
    if not 1 <= rating <= 5:
        return None
    return rating


def parse_csv_upload_rows(
    upload_file,
    access_type,
    *,
    max_csv_rows,
    max_csv_field_length,
    max_review_text_length,
    free_plan_max_reviews,
    onetime_max_reviews,
):
    raw_bytes = upload_file.read()
    csv_content = None
    for encoding in ('utf-8-sig', 'utf-8', 'cp1252', 'latin-1'):
        try:
            csv_content = raw_bytes.decode(encoding)
            break
        except UnicodeDecodeError:
            continue
    if csv_content is None:
        return None, 'CSV decoding failed. Use UTF-8 encoded text and try again.', None

    csv_file = StringIO(csv_content)
    reader = csv.DictReader(csv_file)
    if not reader.fieldnames:
        return None, 'Your CSV appears empty or missing headers. Add a header row and try again.', None

    column_mapping, missing_required, diagnostics = _resolve_csv_column_mapping(reader.fieldnames)
    if missing_required or diagnostics.get('ambiguous'):
        visible_columns = ', '.join([name.strip() for name in reader.fieldnames if name and name.strip()][:12]) or 'none detected'
        normalized_columns = ', '.join(diagnostics.get('normalized_headers', [])[:16]) or 'none detected'
        rating_synonyms = ', '.join(diagnostics.get('attempted_synonyms', {}).get('rating', [])[:20]) or 'none'
        review_synonyms = ', '.join(diagnostics.get('attempted_synonyms', {}).get('review_text', [])[:20]) or 'none'
        ambiguity_details = diagnostics.get('ambiguous', {})
        ambiguity_line = ''
        if ambiguity_details:
            parts = []
            for key, candidates in ambiguity_details.items():
                parts.append(f"{key}: {', '.join(candidates)}")
            ambiguity_line = f" Ambiguous matches - {'; '.join(parts)}."
        return (
            None,
            "We couldn't find the required columns for rating and review text. "
            "Tried synonyms for rating and review text using exact + loose token matching. "
            f"Detected columns: {visible_columns}. "
            f"Normalized headers: {normalized_columns}. "
            f"Rating synonyms tried: {rating_synonyms}. "
            f"Review text synonyms tried: {review_synonyms}.{ambiguity_line}",
            None,
        )

    max_reviews_allowed = _max_reviews_for_access_type(
        access_type,
        free_plan_max_reviews,
        onetime_max_reviews,
        max_csv_rows,
    )
    valid_rows = []
    row_count = 0
    skipped_due_to_plan_limit = 0
    dropped_rows = 0

    for row in reader:
        row_count += 1
        if row_count > max_csv_rows:
            return None, f'CSV has too many rows. Maximum allowed is {max_csv_rows}.', None

        for column_name, raw_value in row.items():
            value_text = str(raw_value or '').strip()
            if len(value_text) > max_csv_field_length:
                label = str(column_name or 'unknown')
                return None, (
                    f'CSV field too long at row {row_count}, column "{label}". '
                    f'Maximum allowed is {max_csv_field_length} characters.'
                ), None

        rating_source = row.get(column_mapping.get('rating', ''), '')
        review_source = row.get(column_mapping.get('review_text', ''), '')
        date_source = row.get(column_mapping.get('date', ''), '') if column_mapping.get('date') else ''

        rating = _parse_rating_value(rating_source)
        review_text = str(review_source or '').strip()
        if rating is None or not review_text:
            dropped_rows += 1
            continue

        date_value = _normalize_review_date(date_source)

        cleaned_text = bleach.clean(review_text, strip=True)
        if len(cleaned_text) > max_review_text_length:
            dropped_rows += 1
            continue

        if len(valid_rows) < max_reviews_allowed:
            valid_rows.append((date_value, rating, cleaned_text))
        else:
            if access_type == 'trial':
                skipped_due_to_plan_limit += 1
                continue
            if access_type == 'onetime':
                return None, (
                    f'Free supports up to {onetime_max_reviews} reviews per report. '
                    'Upgrade to Team or Firm for larger uploads.'
                ), None
            return None, f'Upload exceeds the per-report limit of {max_reviews_allowed} reviews.', None

    if not valid_rows:
        return (
            None,
            'No valid review rows were found after automatic column mapping. '
            'Make sure each row has a rating (1-5) and review text.',
            None,
        )

    return valid_rows, None, {
        'applied_review_limit': max_reviews_allowed,
        'truncated_for_plan': skipped_due_to_plan_limit > 0,
        'skipped_due_to_plan_limit': skipped_due_to_plan_limit,
        'dropped_rows': dropped_rows,
        'column_mapping': column_mapping,
    }
