from collections import Counter


THEME_KEYWORDS = {
    'Communication': ['communication', 'responsive', 'returned calls', 'kept me informed', 'updates', 'contact'],
    'Professionalism': ['professional', 'courteous', 'respectful', 'polite', 'demeanor', 'ethical'],
    'Legal Expertise': ['knowledgeable', 'experienced', 'expert', 'skilled', 'competent', 'expertise'],
    'Case Outcome': ['won', 'successful', 'settlement', 'verdict', 'result', 'outcome', 'resolved'],
    'Cost/Value': ['expensive', 'affordable', 'fees', 'billing', 'cost', 'worth it', 'value', 'price'],
    'Responsiveness': ['quick', 'slow', 'delayed', 'waiting', 'timely', 'immediately', 'promptly'],
    'Compassion': ['caring', 'understanding', 'empathetic', 'compassionate', 'listened', 'supportive'],
    'Staff Support': ['staff', 'assistant', 'paralegal', 'secretary', 'team', 'office'],
}


def classify_themes_in_reviews(reviews):
    theme_counts = Counter()
    for review in reviews or []:
        text_lower = (review.get('review_text') or '').lower()
        for theme, keywords in THEME_KEYWORDS.items():
            if any(keyword in text_lower for keyword in keywords):
                theme_counts[theme] += 1
    return dict(theme_counts.most_common(8))


def summarize_review_rows(reviews, all_reviews=None):
    if not reviews:
        return {
            'total_reviews': 0,
            'avg_rating': 0,
            'themes': {},
            'top_praise': [],
            'top_complaints': [],
            'all_reviews': [],
        }

    total_reviews = len(reviews)
    avg_rating = sum(r['rating'] for r in reviews) / total_reviews
    top_praise = [r for r in reviews if r['rating'] >= 4][:10]
    top_complaints = [r for r in reviews if r['rating'] <= 2][:10]

    return {
        'total_reviews': total_reviews,
        'avg_rating': round(avg_rating, 2),
        'themes': classify_themes_in_reviews(reviews),
        'top_praise': top_praise,
        'top_complaints': top_complaints,
        'all_reviews': all_reviews if all_reviews is not None else reviews,
    }
