create_migration_table="CREATE TABLE migrations(last_applied TEXT,hash TEXT);"
psql -c "$create_migration_table" 2> /dev/null > /dev/null

last_applied_query_result=`psql -c 'SELECT last_applied FROM migrations FETCH FIRST 1 ROWS ONLY;'`

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
        psql -f $f
    fi
done

last_applied=`basename $f`
echo "locking migrations..."

if test $last_applied_number -eq 0; then
    psql -c "INSERT INTO migrations (last_applied) VALUES ('$last_applied');"
else   
    psql -c "UPDATE migrations SET last_applied='$last_applied';"
fi
