const DAY_CUTOFF_HOUR = 6; // 6 AM
const NIGHT_CUTOFF_HOUR = 18; // 6 PM
const getDayOrNight= (): "day" | "night" => {
    const hour = new Date().getHours();
    return hour >= DAY_CUTOFF_HOUR && hour < NIGHT_CUTOFF_HOUR ? "day" : "night";
}
export { getDayOrNight };
