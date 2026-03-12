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

    const events = [
        {
            name: "Lollapalooza Chicago",
            start_date: "2026-07-30",
            end_date: "2026-08-02",
            status: "draft",
            created_by: 1,
            location_id: 1
        },
        {
            name: "Summer Smash Festival",
            start_date: "2026-06-20",
            end_date: "2026-06-22",
            status: "active",
            created_by: 1,
            location_id: 2
        },
        {
            name: "North Coast Music Festival",
            start_date: "2026-09-04",
            end_date: "2026-09-06",
            status: "completed",
            created_by: 1,
            location_id: 3
        },
        {
            name: "Arc Music Festival",
            start_date: "2026-08-29",
            end_date: "2026-08-31",
            status: "draft",
            created_by: 1,
            location_id: 1
        },
        {
            name: "Chicago Jazz Festival",
            start_date: "2026-08-27",
            end_date: "2026-08-30",
            status: "active",
            created_by: 1,
            location_id: 2
        }
    ];

    const locations = [
        {
            name: "Main Convention Center",
            street: "123 Downtown Ave",
            city: "Chicago",
            state: "IL",
            zip_code: "60601",
        },
        {
            name: "Lakeside Park Pavilion",
            street: "455 Lake Shore Dr",
            city: "Chicago",
            state: "IL",
            zip_code: "60611",
        },
        {
            name: "West Community Hall",
            street: "890 West Madison St",
            city: "Chicago",
            state: "IL",
            zip_code: "60607",
        },
        {
            name: "North Event Plaza",
            street: "2100 Lincoln Ave",
            city: "Chicago",
            state: "IL",
            zip_code: "60614",
        },
        {
            name: "South Expo Center",
            street: "7750 South Halsted St",
            city: "Chicago",
            state: "IL",
            zip_code: "60620",
        }
    ];

    const applications = [
        {
            status: "pending",
            applied_at: "03/01/2026",
            reviewed_by_user_id: 1,
            reviewed_at: "03/02/2026",
            user_id: 1,
            event_id: 1
        },
        {
            status: "approved",
            applied_at: "03/01/2026",
            reviewed_by_user_id: 2,
            reviewed_at: "03/03/2026",
            user_id: 2,
            event_id: 1
        },
        {
            status: "rejected",
            applied_at: "03/02/2026",
            reviewed_by_user_id: 3,
            reviewed_at: "03/04/2026",
            user_id: 3,
            event_id: 2
        },
        {
            status: "approved",
            applied_at: "03/03/2026",
            reviewed_by_user_id: 2,
            reviewed_at: "03/05/2026",
            user_id: 4,
            event_id: 2
        },
        {
            status: "pending",
            applied_at: "03/04/2026",
            reviewed_by_user_id: 1,
            reviewed_at: "03/06/2026",
            user_id: 5,
            event_id: 3
        }
    ];

    const shifts = [
        {
            name: "Morning Setup",
            start_time: "08:00",
            end_time: "12:00",
            required_staff: 5,
            event_id: 1
        },
        {
            name: "Afternoon Operations",
            start_time: "12:00",
            end_time: "16:00",
            required_staff: 8,
            event_id: 1
        },
        {
            name: "Evening Cleanup",
            start_time: "16:00",
            end_time: "20:00",
            required_staff: 4,
            event_id: 1
        },
        {
            name: "Morning Registration",
            start_time: "09:00",
            end_time: "13:00",
            required_staff: 6,
            event_id: 2
        },
        {
            name: "Security Coverage",
            start_time: "13:00",
            end_time: "18:00",
            required_staff: 3,
            event_id: 3
        }
    ];

    // insert only if table is empty
    // Departments
    const departmentCount = await db.Department.count();
    if (departmentCount === 0) {
        await db.Department.bulkCreate(departments);
        console.log("Departments seeded");
    }

    // Roles
    const roleCount = await db.Role.count();
    if (roleCount === 0) {
        await db.Role.bulkCreate(roles);
        console.log("Roles seeded");
    }

    // Locations
    const locationCount = await db.Location.count();
    if (locationCount === 0) {
        await db.Location.bulkCreate(locations);
        console.log("Locations seeded");
    }

    // Users
    const userCount = await db.User.count();
    if (userCount === 0) {
        await db.User.bulkCreate(users);
        console.log("Users seeded");
    }

    // Events
    const eventCount = await db.Event.count();
    if (eventCount === 0) {
        await db.Event.bulkCreate(events);
        console.log("Events seeded");
    }

    // Shifts
    const shiftCount = await db.Shift.count();
    if (shiftCount === 0) {
        await db.Shift.bulkCreate(shifts);
        console.log("Shifts seeded");
    }

    // Applications
    const applicationCount = await db.Application.count();
    if (applicationCount === 0) {
        await db.Application.bulkCreate(applications);
        console.log("Applications seeded");
    }


}