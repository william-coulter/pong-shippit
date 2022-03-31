player1="Will"
player2="David"
player3="Vishal"

echo "setting up dummy environment\n"

echo "creating player '$player1'..."
curl --header "Content-Type: application/json" --header "X-Api-Key: secret-key" \
  --request POST \
  --data "{\"name\":\"$player1\"}" \
  http://localhost:3000/pong-shippit/players/create

echo "creating player '$player2'..."
curl --header "Content-Type: application/json" --header "X-Api-Key: secret-key" \
  --request POST \
  --data "{\"name\":\"$player2\"}" \
  http://localhost:3000/pong-shippit/players/create

echo "creating player '$player3'..."
curl --header "Content-Type: application/json" --header "X-Api-Key: secret-key" \
  --request POST \
  --data "{\"name\":\"$player3\"}" \
  http://localhost:3000/pong-shippit/players/create

echo "creating games..."
curl --header "Content-Type: application/json" --header "X-Api-Key: secret-key" \
  --request POST \
  --data "{\"player1\":\"$player1\", \"player2\":\"$player2\", \"player1Score\":11, \"player2Score\":1}" \
  http://localhost:3000/pong-shippit/games/create

curl --header "Content-Type: application/json" --header "X-Api-Key: secret-key" \
  --request POST \
  --data "{\"player1\":\"$player1\", \"player2\":\"$player3\", \"player1Score\":11, \"player2Score\":3}" \
  http://localhost:3000/pong-shippit/games/create

curl --header "Content-Type: application/json" --header "X-Api-Key: secret-key" \
  --request POST \
  --data "{\"player1\":\"$player2\", \"player2\":\"$player3\", \"player1Score\":9, \"player2Score\":11}" \
  http://localhost:3000/pong-shippit/games/create

curl --header "Content-Type: application/json" --header "X-Api-Key: secret-key" \
  --request POST \
  --data "{\"player1\":\"$player1\", \"player2\":\"$player2\", \"player1Score\":11, \"player2Score\":9}" \
  http://localhost:3000/pong-shippit/games/create

curl --header "Content-Type: application/json" --header "X-Api-Key: secret-key" \
  --request POST \
  --data "{\"player1\":\"$player1\", \"player2\":\"$player2\", \"player1Score\":11, \"player2Score\":9}" \
  http://localhost:3000/pong-shippit/games/create

curl --header "Content-Type: application/json" --header "X-Api-Key: secret-key" \
  --request POST \
  --data "{\"player1\":\"$player1\", \"player2\":\"$player2\", \"player1Score\":9, \"player2Score\":11}" \
  http://localhost:3000/pong-shippit/games/create

curl --header "Content-Type: application/json" --header "X-Api-Key: secret-key" \
  --request POST \
  --data "{\"player1\":\"$player1\", \"player2\":\"$player3\", \"player1Score\":5, \"player2Score\":11}" \
  http://localhost:3000/pong-shippit/games/create

curl --header "Content-Type: application/json" --header "X-Api-Key: secret-key" \
  --request POST \
  --data "{\"player1\":\"$player2\", \"player2\":\"$player3\", \"player1Score\":11, \"player2Score\":9}" \
  http://localhost:3000/pong-shippit/games/create

curl --header "Content-Type: application/json" --header "X-Api-Key: secret-key" \
  --request POST \
  --data "{\"player1\":\"$player2\", \"player2\":\"$player3\", \"player1Score\":11, \"player2Score\":9}" \
  http://localhost:3000/pong-shippit/games/create

curl --header "Content-Type: application/json" --header "X-Api-Key: secret-key" \
  --request POST \
  --data "{\"player1\":\"$player1\", \"player2\":\"$player3\", \"player1Score\":7, \"player2Score\":11}" \
  http://localhost:3000/pong-shippit/games/create

curl --header "Content-Type: application/json" --header "X-Api-Key: secret-key" \
  --request POST \
  --data "{\"player1\":\"$player1\", \"player2\":\"$player3\", \"player1Score\":7, \"player2Score\":11}" \
  http://localhost:3000/pong-shippit/games/create

curl --header "Content-Type: application/json" --header "X-Api-Key: secret-key" \
  --request POST \
  --data "{\"player1\":\"$player2\", \"player2\":\"$player3\", \"player1Score\":4, \"player2Score\":11}" \
  http://localhost:3000/pong-shippit/games/create

curl --header "Content-Type: application/json" --header "X-Api-Key: secret-key" \
  --request POST \
  --data "{\"player1\":\"$player1\", \"player2\":\"$player3\", \"player1Score\":11, \"player2Score\":9}" \
  http://localhost:3000/pong-shippit/games/create

curl --header "Content-Type: application/json" --header "X-Api-Key: secret-key" \
  --request POST \
  --data "{\"player1\":\"$player1\", \"player2\":\"$player3\", \"player1Score\":11, \"player2Score\":5}" \
  http://localhost:3000/pong-shippit/games/create
