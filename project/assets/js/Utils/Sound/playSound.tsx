export default function playSound(sound: string): void {
    // if (settings.sound === 1) {
        let audio = new Audio(sound);
        audio.currentTime = 0;
        audio.play();
    // }
}