/**
 * Gets the hour and minutes from the date time variable, and converts it to a simple string format.
 * 
 * @param time The datetime to convert into a string format.
 * @returns A string formatted like: `{hour}:{minutes}`
 */
export const timeToString = (time: Date) => {
    let hour = time.getHours().toFixed(0);
    if (hour.length == 1) {
        hour = `0${hour}`;
    }
    let minutes = time.getMinutes().toFixed(0);
    if (minutes.length == 1) {
        minutes = `${minutes}0`;
    }

    return `${hour}:${minutes}`;
}
