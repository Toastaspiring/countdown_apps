function calculateTimeRemaining(target, now) {
    const difference = target - now;

    if (difference <= 0) {
        return {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            isOver: true,
        };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, isOver: false };
}

// Browser-specific code
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        const messageEl = document.getElementById('countdown-message');
        const targetTimeDisplay = document.getElementById('target-time-display');

        let countdownInterval;

        async function startCountdown() {
            const response = await fetch('config.json');
            const config = await response.json();

            const { eventName, targetDate, targetTimezone, targetTimeString } = config;

            document.querySelector('h1').textContent = eventName;
            targetTimeDisplay.textContent = `Counting down to the ${eventName} on ${targetTimeString}.`;

            const target = dateFnsTz.zonedTimeToUtc(targetDate, targetTimezone);

            const requestNotificationPermission = () => {
                if ('Notification' in window) {
                    Notification.requestPermission().then(permission => {
                        if (permission === 'denied') {
                            console.log('Notification permission denied.');
                        }
                    });
                }
            };

            requestNotificationPermission();

            function updateCountdown() {
                const now = new Date();
                const { days, hours, minutes, seconds, isOver } = calculateTimeRemaining(target, now);

                if (isOver) {
                    clearInterval(countdownInterval);
                    daysEl.textContent = '00';
                    hoursEl.textContent = '00';
                    minutesEl.textContent = '00';
                    secondsEl.textContent = '00';
                    messageEl.textContent = "The countdown is over!";
                    messageEl.classList.add('end-message');
                    targetTimeDisplay.textContent = "The event has started!";

                    if (Notification.permission === 'granted') {
                        new Notification('Countdown Finished!', {
                            body: `The event "${eventName}" has arrived!`,
                            icon: 'https://placehold.co/48x48/6c63ff/ffffff?text=🎉'
                        });
                    }
                    return;
                }

                daysEl.textContent = String(days).padStart(2, '0');
                hoursEl.textContent = String(hours).padStart(2, '0');
                minutesEl.textContent = String(minutes).padStart(2, '0');
                secondsEl.textContent = String(seconds).padStart(2, '0');

                const localTargetTime = target.toLocaleString();
                messageEl.textContent = `Target time in your timezone is: ${localTargetTime}`;
            }

            updateCountdown();
            countdownInterval = setInterval(updateCountdown, 1000);
        }

        startCountdown();
    });
}

// Export for testing in Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { calculateTimeRemaining };
}
