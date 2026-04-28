import os
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

os.environ["FLASK_ENV"] = "development"
os.environ["DATABASE_URL"] = "sqlite:///:memory:"
os.environ["SECRET_KEY"] = "test-secret-key"

from app import create_app, db


class TodoApiTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.app.config.update(TESTING=True)
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()
        self.client = self.app.test_client()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_health_endpoint(self):
        response = self.client.get("/api/health")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json()["status"], "ok")

    def test_create_and_fetch_todo(self):
        payload = {
            "title": "Write tests",
            "description": "Cover the API flow",
            "priority": "high",
            "category": "Work",
        }

        create_response = self.client.post("/api/todos", json=payload)
        self.assertEqual(create_response.status_code, 201)

        created = create_response.get_json()
        fetch_response = self.client.get(f"/api/todos/{created['id']}")

        self.assertEqual(fetch_response.status_code, 200)
        self.assertEqual(fetch_response.get_json()["title"], payload["title"])

    def test_list_filters_and_stats(self):
        self.client.post(
            "/api/todos",
            json={"title": "Active task", "priority": "medium", "category": "General"},
        )
        completed_response = self.client.post(
            "/api/todos",
            json={
                "title": "Completed task",
                "priority": "low",
                "category": "Personal",
                "is_completed": True,
            },
        )

        completed_id = completed_response.get_json()["id"]

        active_response = self.client.get("/api/todos?status=active")
        completed_list_response = self.client.get("/api/todos?status=completed")
        stats_response = self.client.get("/api/stats")

        self.assertEqual(active_response.status_code, 200)
        self.assertEqual(completed_list_response.status_code, 200)
        self.assertEqual(stats_response.status_code, 200)
        self.assertEqual(len(active_response.get_json()), 1)
        self.assertEqual(completed_list_response.get_json()[0]["id"], completed_id)

        stats = stats_response.get_json()
        self.assertEqual(stats["total"], 2)
        self.assertEqual(stats["active"], 1)
        self.assertEqual(stats["completed"], 1)

    def test_update_and_delete_todo(self):
        create_response = self.client.post(
            "/api/todos",
            json={"title": "Refine task", "priority": "medium", "category": "Study"},
        )
        todo_id = create_response.get_json()["id"]

        update_response = self.client.put(
            f"/api/todos/{todo_id}",
            json={"title": "Refined task", "is_completed": True},
        )
        delete_response = self.client.delete(f"/api/todos/{todo_id}")
        missing_response = self.client.get(f"/api/todos/{todo_id}")

        self.assertEqual(update_response.status_code, 200)
        self.assertEqual(update_response.get_json()["title"], "Refined task")
        self.assertTrue(update_response.get_json()["is_completed"])
        self.assertEqual(delete_response.status_code, 200)
        self.assertEqual(missing_response.status_code, 404)

    def test_validation_error_for_empty_title(self):
        response = self.client.post(
            "/api/todos",
            json={"title": "", "priority": "medium", "category": "General"},
        )

        self.assertEqual(response.status_code, 422)
        self.assertIn("title", response.get_json()["errors"])


if __name__ == "__main__":
    unittest.main()
