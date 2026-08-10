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

    const countdownStyle = (value: number) =>
        ({ "--value": value, "--digits": 2 } as React.CSSProperties);

    return (
        <div className="clock-container">
            <div className="date">
                <span className="date text-2xl">{date}</span>
            </div>
            <div className="time-display">

                <span className="countdown font-mono text-14xl">
                    <span
                        style={countdownStyle(time.getHours())}
                        aria-live="polite"
                        aria-label={hours}
                    >
                        {hours}
                    </span>
                </span>

                <span className="time-separator">:</span>

                <span className="countdown font-mono text-14xl">
                    <span
                        style={countdownStyle(time.getMinutes())}
                        aria-live="polite"
                        aria-label={minutes}
                    >
                        {minutes}
                    </span>
                </span>

                <span className="time-separator">:</span>

                <span className="countdown font-mono text-14xl">
                    <span
                        style={countdownStyle(time.getSeconds())}
                        aria-live="polite"
                        aria-label={seconds}
                    >
                        {seconds}
                    </span>
                </span>
            </div>

        </div>
    );
}

export default Clock;
