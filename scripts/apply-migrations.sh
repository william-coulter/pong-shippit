migration_lock_path="migrations/migration.lock"
migration_lock_prefix="last applied: "

if test ! -e $migration_lock_path
then
    for f in migrations/*.sql; do
        echo "applying $f"
        PGPASSWORD=pong psql -h localhost -p 5432 -U pong -f $f
    done
else
    last_applied=`cat $migration_lock_path | grep "$migration_lock_prefix" | sed "s/$migration_lock_prefix//g"`
    last_applied_number=`basename $last_applied | sed -E 's/\_.+\.sql//g'`

    for f in migrations/*.sql; do
        curr_migration_number=`basename $f | sed -E 's/\_.+\.sql//g'`
        if test $curr_migration_number -gt $last_applied_number; then
            echo "applying $f"
            PGPASSWORD=pong psql -h localhost -p 5432 -U pong -f $f
        fi
    done
fi

last_applied=$f
echo "\nlocking migrations..."
echo "$migration_lock_prefix$last_applied" > $migration_lock_path

# TODO:
#   - Hash as a quick way to determine if anything has changed and the 
#     integrity of the already applied migrations: 
#            $ find migrations -type f -exec shasum -a 256 {}
#   - Store the last applied migration in the database  
#   - Stop executing / revert if a migration has an error
