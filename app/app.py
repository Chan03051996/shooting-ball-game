from flask import Flask, render_template, request, jsonify
import boto3
import os
from botocore.exceptions import ClientError

app = Flask(__name__)

# AWS / Floci Configuration
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")
AWS_ENDPOINT = os.getenv("AWS_ENDPOINT", "http://floci:4566")
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID", "test")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY", "test")
TABLE_NAME = os.getenv("DYNAMODB_TABLE", "GameScores")

# DynamoDB Connection
dynamodb = boto3.resource(
    "dynamodb",
    region_name=AWS_REGION,
    endpoint_url=AWS_ENDPOINT,
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
)

table = dynamodb.Table(TABLE_NAME)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/health")
def health():
    return jsonify({"status": "UP"}), 200


@app.route("/save-score", methods=["POST"])
def save_score():
    """
    Example JSON:
    {
        "player": "Chandan",
        "score": 250
    }
    """

    data = request.get_json()

    if not data:
        return jsonify({"error": "JSON body is required"}), 400

    player = data.get("player")
    score = data.get("score")

    if player is None or score is None:
        return jsonify({"error": "player and score are required"}), 400

    try:
        table.put_item(
            Item={
                "PlayerName": str(player),
                "Score": int(score)
            }
        )

        return jsonify({
            "message": "Score saved successfully",
            "player": player,
            "score": score
        }), 200

    except ClientError as e:
        return jsonify({
            "error": str(e)
        }), 500


@app.route("/scores", methods=["GET"])
def get_scores():
    try:
        response = table.scan()

        return jsonify(
            response.get("Items", [])
        ), 200

    except ClientError as e:
        return jsonify({
            "error": str(e)
        }), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
