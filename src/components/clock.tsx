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
        <div className="flex flex-col items-center">
            <div className="text-2xl text-white">{date}</div>
            <div className="flex items-center gap-px">

                <span className="countdown font-mono text-14xl text-white">
                    <span
                        style={countdownStyle(time.getHours())}
                        aria-live="polite"
                        aria-label={hours}
                    >
                        {hours}
                    </span>
                </span>

                <span className="text-14xl text-white font-bold animate-blink">:</span>

                <span className="countdown font-mono text-14xl text-white">
                    <span
                        style={countdownStyle(time.getMinutes())}
                        aria-live="polite"
                        aria-label={minutes}
                    >
                        {minutes}
                    </span>
                </span>

                <span className="text-14xl text-white font-bold animate-blink">:</span>

                <span className="countdown font-mono text-14xl text-white">
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
