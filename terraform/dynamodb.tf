resource "aws_dynamodb_table" "scores" {

  name = "GameScores"

  billing_mode = "PAY_PER_REQUEST"

  hash_key = "PlayerName"

  attribute {

    name = "PlayerName"

    type = "S"

  }

}
