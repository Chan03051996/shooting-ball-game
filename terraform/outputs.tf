output "dynamodb_table" {
  value = aws_dynamodb_table.scores.name
}

output "region" {
  value = "us-east-1"
}
