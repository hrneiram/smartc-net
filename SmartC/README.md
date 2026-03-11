# Instalation .Net Ubuntu 22.04

**Main Documentation:** https://learn.microsoft.com/en-us/dotnet/core/install/linux-ubuntu-install?tabs=dotnet10&pivots=os-linux-ubuntu-2204

1) Install .NET

http://learn.microsoft.com/en-us/dotnet/core/install/linux-ubuntu-install?tabs=dotnet10&pivots=os-linux-ubuntu-2204

```bash
sudo add-apt-repository ppa:dotnet/backports
sudo apt-get update && \
  sudo apt-get install -y dotnet-sdk-10.0
```

Optional install the runtime

```bash
sudo apt-get update && \
  sudo apt-get install -y aspnetcore-runtime-10.0
```

Verify installation
```bash
dotnet --version
```

2) Install Posgresql

https://ubuntu.com/server/docs/how-to/databases/install-postgresql/

```bash
sudo apt update

# postgresql-contrib for Generating UUIDs with uuid-ossp
sudo apt install -y postgresql postgresql-contrib

# Activate the service
sudo systemctl start postgresql

# Enter in postgres
sudo -i -u postgres
```

Once in posgresql:

```postgres
createuser --superuser name_of_user
createdb smartc
exit
```

for adding the password
```postgres
psql
ALTER ROLE user WITH PASSWORD 'password';
\q
```

verify the database was created:

```bash
psql -d smartc -c "SELECT 1;"
```

Enter in the database and add users:
```bash
psql
\c smartc
INSERT INTO "Users" ("Email", "Password", "Role")
VALUES ('admin@example.com', 'TuPasswordPlanoOMejorsHasheada', 1);  -- 1 = Admin
INSERT INTO "Users" ("Email", "Password", "Role")
VALUES ('viewer@example.com', 'TuPasswordPlanoOMejorsHasheada', 0);  -- 0 = Admin
SELECT * FROM "Users";
```

3) Add packages

```bash
# Authentication dependency
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer

# Swagger
dotnet add package Swashbuckle.AspNetCore

# Git ignore file, this was moved and edited in the root folder
dotnet new gitignore

# Add entity framework core (transitive dependecy) and postgres support
# It is used to create the DbContext
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL

# Add support for migrations in EntityFramework
dotnet add package Microsoft.EntityFrameworkCore.Design
```

4) Migration first time

```bash
dotnet tool install --global dotnet-ef
dotnet ef migrations add InitialCreate
dotnet ef database update
```


**Commands to run the project**
```bash
# Build the project
dotnet build

# Run the project
dotnet run
```



