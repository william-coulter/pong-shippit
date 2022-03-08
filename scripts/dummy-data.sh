echo "setting up dummy environment"

echo "creating player 'Will'..."
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"name":"Will"}' \
  http://localhost:3000/pong-shippit/players/create

echo "creating player 'David'..."
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"name":"David"}' \
  http://localhost:3000/pong-shippit/players/create

echo "Creating games"
