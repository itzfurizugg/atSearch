import { useState, useEffect } from "react";

function Clock() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    const hours = String(time.getHours()).padStart(2, "0");
    const minutes = String(time.getMinutes()).padStart(2, "0");
    const seconds = String(time.getSeconds()).padStart(2, "0");

    const date = String(time.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    }));

    return (
        <div className="clock-container">
            <div className="time-display">
                <span className="time-digits">{hours}</span>
                <span className="time-separator">:</span>
                <span className="time-digits">{minutes}</span>
                <span className="time-separator">:</span>
                <span className="time-digits">{seconds}</span>
            </div>

            <div className="date">
                <span className="date">{date}</span>
            </div>
        </div>
    );
}

export default Clock;