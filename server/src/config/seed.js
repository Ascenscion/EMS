import bcrypt from "bcrypt";

const DEMO_PASSWORD = "DemoPass123!";

export async function seedDatabase(db) {
    const demoPasswordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

    const departments = [
        { name: "Operations" },
        { name: "Security" },
        { name: "Ticketing" },
        { name: "Stage Crew" },
        { name: "Medical" }
    ];

    const roles = [
        { name: "Admin" },
        { name: "Staff" },
        { name: "Master" }
    ];

    const users = [
        {
            first_name: "Carlos",
            last_name: "Ramirez",
            email: "carlos.ramirez@email.com",
            phone: "3125551001",
            password_hash: demoPasswordHash,
            department_id: 1,
            role_id: 1,
            is_active: true
        },
        {
            first_name: "Maria",
            last_name: "Lopez",
            email: "maria.lopez@email.com",
            phone: "3125551002",
            password_hash: demoPasswordHash,
            department_id: 2,
            role_id: 2,
            is_active: true
        },
        {
            first_name: "Daniel",
            last_name: "Ortiz",
            email: "daniel.ortiz@email.com",
            phone: "3125551003",
            password_hash: demoPasswordHash,
            department_id: 3,
            role_id: 3,
            is_active: true
        },
        {
            first_name: "Sofia",
            last_name: "Martinez",
            email: "sofia.martinez@email.com",
            phone: "3125551004",
            password_hash: demoPasswordHash,
            department_id: 1,
            role_id: 2,
            is_active: true
        },
        {
            first_name: "Luis",
            last_name: "Hernandez",
            email: "luis.hernandez@email.com",
            phone: "3125551005",
            password_hash: demoPasswordHash,
            department_id: 2,
            role_id: 2,
            is_active: true
        },
        {
            first_name: "Elena",
            last_name: "Vargas",
            email: "elena.vargas@email.com",
            phone: "3125551006",
            password_hash: demoPasswordHash,
            department_id: 4,
            role_id: 2,
            is_active: false
        },
        {
            first_name: "Miguel",
            last_name: "Santos",
            email: "miguel.santos@email.com",
            phone: "3125551007",
            password_hash: demoPasswordHash,
            department_id: 5,
            role_id: 2,
            is_active: false
        }
    ];

    const events = [
        {
            name: "Lollapalooza Chicago",
            start_date: "2026-07-30",
            end_date: "2026-08-02",
            max_users: 125,
            description: "Four-day festival staffing for access control, guest services, and field operations.",
            status: "active",
            created_by: 1,
            location_id: 1
        },
        {
            name: "Summer Smash Festival",
            start_date: "2026-08-15",
            end_date: "2026-08-17",
            max_users: 80,
            description: "Weekend event staffing for entry gates, credential checks, and crowd support.",
            status: "active",
            created_by: 1,
            location_id: 2
        },
        {
            name: "North Coast Music Festival",
            start_date: "2026-09-04",
            end_date: "2026-09-06",
            max_users: 65,
            description: "Upcoming staffing plan for operations, security support, and guest experience teams.",
            status: "draft",
            created_by: 1,
            location_id: 3
        },
        {
            name: "Arc Music Festival",
            start_date: "2026-08-29",
            end_date: "2026-08-31",
            max_users: 70,
            description: "Active staffing request for venue operations, ticket scanning, and VIP support.",
            status: "active",
            created_by: 1,
            location_id: 4
        },
        {
            name: "Spring Staffing Expo",
            start_date: "2026-06-12",
            end_date: "2026-06-14",
            max_users: 35,
            description: "Completed staffing engagement retained for reporting and request-history demos.",
            status: "completed",
            created_by: 1,
            location_id: 5
        }
    ];

    const locations = [
        {
            name: "Grant Park",
            address_line_1: "337 E Randolph St",
            city: "Chicago",
            state: "IL",
            zip_code: "60601",
        },
        {
            name: "SeatGeek Stadium",
            address_line_1: "7000 S Harlem Ave",
            city: "Chicago",
            state: "IL",
            zip_code: "60455",
        },
        {
            name: "Huntington Bank Pavilion",
            address_line_1: "1300 S Linn White Dr",
            city: "Chicago",
            state: "IL",
            zip_code: "60605",
        },
        {
            name: "Union Park",
            address_line_1: "1501 W Randolph St",
            city: "Chicago",
            state: "IL",
            zip_code: "60607",
        },
        {
            name: "Navy Pier Festival Hall",
            address_line_1: "600 E Grand Ave",
            city: "Chicago",
            state: "IL",
            zip_code: "60611",
        }
    ];

    const applications = [
        {
            status: "pending",
            applied_at: "2026-07-20 09:15:00",
            reviewed_by_user_id: null,
            reviewed_at: null,
            user_id: 2,
            event_id: 1,
            shift_id: 1
        },
        {
            status: "approved",
            applied_at: "2026-07-18 13:30:00",
            reviewed_by_user_id: 1,
            reviewed_at: "2026-07-19 10:00:00",
            user_id: 4,
            event_id: 1,
            shift_id: 2
        },
        {
            status: "rejected",
            applied_at: "2026-07-17 11:45:00",
            reviewed_by_user_id: 1,
            reviewed_at: "2026-07-18 09:20:00",
            user_id: 5,
            event_id: 2,
            shift_id: 3
        },
        {
            status: "approved",
            applied_at: "2026-07-16 15:00:00",
            reviewed_by_user_id: 3,
            reviewed_at: "2026-07-17 12:10:00",
            user_id: 2,
            event_id: 2,
            shift_id: 1
        },
        {
            status: "pending",
            applied_at: "2026-07-21 08:40:00",
            reviewed_by_user_id: null,
            reviewed_at: null,
            user_id: 4,
            event_id: 3,
            shift_id: 2
        }
    ];

    const shifts = [
        {
            name: "Morning Setup",
            start_time: "2026-07-30 08:00:00",
            end_time: "2026-07-30 14:00:00",
            required_staff: 40,
            event_id: 1
        },
        {
            name: "Guest Services",
            start_time: "2026-07-30 14:00:00",
            end_time: "2026-07-30 22:00:00",
            required_staff: 55,
            event_id: 1
        },
        {
            name: "Evening Breakdown",
            start_time: "2026-08-02 18:00:00",
            end_time: "2026-08-02 23:00:00",
            required_staff: 30,
            event_id: 1
        },
        {
            name: "Gate Operations",
            start_time: "2026-08-15 10:00:00",
            end_time: "2026-08-15 18:00:00",
            required_staff: 35,
            event_id: 2
        },
        {
            name: "Security Support",
            start_time: "2026-09-04 12:00:00",
            end_time: "2026-09-04 22:00:00",
            required_staff: 25,
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
    } else {
        for (const [index, role] of roles.entries()) {
            await db.Role.update(role, {
                where: { id: index + 1 }
            });
        }
    }

    // Locations
    const locationCount = await db.Location.count();
    if (locationCount === 0) {
        await db.Location.bulkCreate(locations);
        console.log("Locations seeded");
    } else {
        for (const [index, location] of locations.entries()) {
            await db.Location.update(location, {
                where: { id: index + 1 }
            });
        }
    }

    // Users
    const userCount = await db.User.count();
    if (userCount === 0) {
        await db.User.bulkCreate(users);
        console.log("Users seeded");
    } else {
        for (const seedUser of users) {
            const user = await db.User.findOne({
                where: { email: seedUser.email }
            });

            if (user) {
                const payload = {
                    ...seedUser,
                    password_hash: user.password_hash?.startsWith("$2")
                        ? user.password_hash
                        : demoPasswordHash
                };

                await user.update(payload);
            } else {
                await db.User.create(seedUser);
            }
        }
    }

    // Events
    const eventCount = await db.Event.count();
    if (eventCount === 0) {
        await db.Event.bulkCreate(events);
        console.log("Events seeded");
    } else {
        for (const [index, event] of events.entries()) {
            await db.Event.update(event, {
                where: { id: index + 1 }
            });
        }
    }

    // Shifts
    const shiftCount = await db.Shift.count();
    if (shiftCount === 0) {
        await db.Shift.bulkCreate(shifts);
        console.log("Shifts seeded");
    } else {
        for (const [index, shift] of shifts.entries()) {
            await db.Shift.update(shift, {
                where: { id: index + 1 }
            });
        }
    }

    // Applications
    const applicationCount = await db.Application.count();
    if (applicationCount === 0) {
        await db.Application.bulkCreate(applications);
        console.log("Applications seeded");
    } else {
        for (const [index, application] of applications.entries()) {
            await db.Application.update(application, {
                where: { id: index + 1 }
            });
        }
    }


}
