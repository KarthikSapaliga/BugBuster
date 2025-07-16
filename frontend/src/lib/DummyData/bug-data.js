export const bugData = {
    bugId: 98765,
    status: "In Progress",
    priority: "Critical",
    module: "Payment Gateway",
    reporter: "Emily Carter",
    assignee: "John Doe",
    dateCreated: "2025-07-12",
    dateResolved: null,
    description:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Consequatur ducimus ullam eius sequi nam vero suscipit natus nostrum blanditiis! Sapiente, quae. Tenetur architecto laboriosam, sequi alias quos iusto quo labore maiores odio at itaque nihil, accusamus sint. Numquam eligendi fugiat velit dignissimos voluptatum earum repudiandae vero sapiente placeat, facere optio.",
    stepsToReproduce: [
        "Go to the checkout page.",
        "Select credit card as payment option.",
        "Enter invalid card details and submit.",
        "Try to refresh the page during processing.",
    ],
    expectedResult:
        "User should see a clear error message and stay on the payment page.",
    actualResult:
        "Payment spinner freezes, user is charged twice, and no confirmation is shown.",

    attachments: [
        {
            fileName: "payment-error.png",
            fileUrl: "/uploads/payment-error.png",
        },
        {
            fileName: "console-log.txt",
            fileUrl: "/uploads/console-log.txt",
        },
    ],
    statusHistory: [
        {
            status: "Resolved",
            date: "2025-07-12",
            by: "Emily Carter",
        },
        {
            status: "Assigned",
            date: "2025-07-13",
            by: "Project Manager",
        },
        {
            status: "In Progress",
            date: "2025-07-14",
            by: "John Doe",
        },
        ,{
            status: "Open",
            date: "2025-07-13",
            by: "Tony Stark"
        }
    ],
};
