from flask import Flask

from routes.bench_routes import bench_bp


def test_legacy_bench_routes_are_frozen():
    app = Flask(__name__)
    app.register_blueprint(bench_bp)
    client = app.test_client()

    response = client.post("/internal/bench/run-all")

    assert response.status_code == 410
    payload = response.get_json()
    assert payload["success"] is False
    assert payload["authoritative_path"] == "/internal/benchmark"
    assert payload["authoritative_route_file"] == "backend/routes/internal_benchmark.py"
