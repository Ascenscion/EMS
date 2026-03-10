export async function seedDatabase(db) {

    const departments = [
        { name: "Operations" },
        { name: "Security" },
        { name: "Ticketing" },
        { name: "Stage Crew" },
        { name: "Medical" }
    ];

    const roles = [
        { name: "Admin" },
        { name: "Supervisor" },
        { name: "Employee" }
    ];

    const users = [
        {
            first_name: "Carlos",
            last_name: "Ramirez",
            email: "carlos.ramirez@email.com",
            phone: "3125551001",
            password_hash: "hashed_password_1",
            department_id: 1,
            role_id: 1
        },
        {
            first_name: "Maria",
            last_name: "Lopez",
            email: "maria.lopez@email.com",
            phone: "3125551002",
            password_hash: "hashed_password_2",
            department_id: 2,
            role_id: 2
        },
        {
            first_name: "Daniel",
            last_name: "Ortiz",
            email: "daniel.ortiz@email.com",
            phone: "3125551003",
            password_hash: "hashed_password_3",
            department_id: 3,
            role_id: 3
        },
        {
            first_name: "Sofia",
            last_name: "Martinez",
            email: "sofia.martinez@email.com",
            phone: "3125551004",
            password_hash: "hashed_password_4",
            department_id: 1,
            role_id: 3
        },
        {
            first_name: "Luis",
            last_name: "Hernandez",
            email: "luis.hernandez@email.com",
            phone: "3125551005",
            password_hash: "hashed_password_5",
            department_id: 2,
            role_id: 3
        }
    ];

    // const events = [
    //     {
    //         name: "Lollapalooza Chicago",
    //         start_date: "2026-07-30",
    //         end_date: "2026-08-02",
    //         status: "Upcoming",
    //         created_by: "Admin",
    //         location_id: 1
    //     },
    //     {
    //         name: "Summer Smash Festival",
    //         start_date: "2026-06-20",
    //         end_date: "2026-06-22",
    //         status: "Upcoming",
    //         created_by: "Admin",
    //         location_id: 2
    //     },
    //     {
    //         name: "North Coast Music Festival",
    //         start_date: "2026-09-04",
    //         end_date: "2026-09-06",
    //         status: "Upcoming",
    //         created_by: "Admin",
    //         location_id: 3
    //     },
    //     {
    //         name: "Arc Music Festival",
    //         start_date: "2026-08-29",
    //         end_date: "2026-08-31",
    //         status: "Upcoming",
    //         created_by: "Admin",
    //         location_id: 1
    //     },
    //     {
    //         name: "Chicago Jazz Festival",
    //         start_date: "2026-08-27",
    //         end_date: "2026-08-30",
    //         status: "Upcoming",
    //         created_by: "Admin",
    //         location_id: 2
    //     }
    // ];

    // insert only if table is empty
    const departmentCount = await db.Department.count();
    if (departmentCount === 0) {
        await db.Department.bulkCreate(departments);
        console.log("Departments seeded");
    }

    const roleCount = await db.Role.count();
    if (roleCount === 0) {
        await db.Role.bulkCreate(roles);
        console.log("Roles seeded");
    }

    const userCount = await db.User.count();
    if (userCount === 0) {
        await db.User.bulkCreate(users);
        console.log("Users seeded");
    }

    // const eventCount = await db.Event.count();
    // if (eventCount === 0) {
    //     await db.Event.bulkCreate(events);
    //     console.log("Users seeded");
    // }
}