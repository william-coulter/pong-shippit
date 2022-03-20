create_migration_table="CREATE TABLE migrations(last_applied TEXT,hash TEXT);"
PGPASSWORD=pong psql -h localhost -p 5432 -U pong -c "$create_migration_table" 2> /dev/null > /dev/null

last_applied_query_result=`PGPASSWORD=pong psql -h localhost -p 5432 -U pong -c 'SELECT last_applied FROM migrations FETCH FIRST 1 ROWS ONLY;'`

if [[ "$last_applied_query_result" == *"0 rows"* ]]; then
    last_applied_number=0
else
    last_applied_number=`echo $last_applied_query_result | sed -E 's/last_applied|\(1 row\)| |-|\_.+\.sql//g'`
fi

echo "last applied number: $last_applied_number"

for f in migrations/*.sql; do
    curr_migration_number=`basename $f | sed -E 's/\_.+\.sql//g'`
    if test $curr_migration_number -gt $last_applied_number; then
        echo "applying $f"
        PGPASSWORD=pong psql -h localhost -p 5432 -U pong -f $f
    fi
done

last_applied=`basename $f`
echo "locking migrations..."

if test $last_applied_number -eq 0; then
    PGPASSWORD=pong psql -h localhost -p 5432 -U pong -c "INSERT INTO migrations (last_applied) VALUES ('$last_applied');"
else   
    PGPASSWORD=pong psql -h localhost -p 5432 -U pong -c "UPDATE migrations SET last_applied='$last_applied';"
fi
