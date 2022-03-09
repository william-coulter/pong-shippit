player1="Will"
player2="David"

echo "setting up dummy environment\n"

echo "creating player '$player1'..."
curl --header "Content-Type: application/json" \
  --request POST \
  --data "{\"name\":\"$player1\"}" \
  http://localhost:3000/pong-shippit/players/create
echo "\n"

echo "creating player '$player2'..."
curl --header "Content-Type: application/json" \
  --request POST \
  --data "{\"name\":\"$player2\"}" \
  http://localhost:3000/pong-shippit/players/create
echo "\n"

echo "creating games..."
curl --header "Content-Type: application/json" \
  --request POST \
  --data "{\"player1\":\"$player1\", \"player2\":\"$player2\", \"player1Score\":11, \"player2Score\":1}" \
  http://localhost:3000/pong-shippit/games/create
