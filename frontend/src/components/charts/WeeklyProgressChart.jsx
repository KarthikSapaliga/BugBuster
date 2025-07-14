import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
    { day: "Mon", pending: 3, completed: 2 },
    { day: "Tue", pending: 1, completed: 4 },
    { day: "Wed", pending: 2, completed: 3 },
    { day: "Thu", pending: 0, completed: 5 },
    { day: "Fri", pending: 4, completed: 1 },
    { day: "Sat", pending: 2, completed: 3 },
    { day: "Sun", pending: 1, completed: 4 },
];

export default function WeeklyProgressChart() {
    return (
        <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
                <CartesianGrid stroke="#eee" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="pending" stroke="#8884d8" />
                <Line type="monotone" dataKey="completed" stroke="#82ca9d" />
            </LineChart>
        </ResponsiveContainer>
    );
}
