c:
cd "c:\Program Files\PostgreSQL\12\bin\"
.\pg_ctl.exe -D "c:\Program Files\PostgreSQL\12\data" start
pause
.\pg_ctl.exe -D "c:\Program Files\PostgreSQL\12\data" stop
exit