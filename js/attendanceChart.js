let chart;

function attendanceChart(scansByDayAndHour) {

var color1 = (localStorage.getItem('layout') === "bright") ? 'rgba(0, 0, 0, 1)' : 'rgba(0, 125, 0, 1)';
var color2 = (localStorage.getItem('layout') === "bright") ? 'rgba(185, 140, 90, 1)' : 'rgba(90, 170, 90, 1)';

//Assuming scansByDayAndHour is your data
const data2 = [];
for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
        const scans = scansByDayAndHour[day][hour].length;
        if (scans > 0) {
            data2.push({x: day, y: hour, r: scans});
        }
    }
}

// Destroy old chart if it exists
if (chart) {
    chart.destroy();
}

    const ctx = document.getElementById('myChart').getContext('2d');
    chart = new Chart(ctx, {
    type: 'bubble',
    data: {
            datasets: [{
                label: 'Scans',
                data: data2,
                backgroundColor: color2,
                borderColor: color1,
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                legend: {
                    labels: {
                        color: color1
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    grid: {
                        color: color1,
                        lineWidth: 0.2
                    },
                    ticks: {
                        color: color1,
                        // Convert numerical day to string
                        callback: function(value, index, values) {
                            return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][value];
                        },
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: color1,
                        lineWidth: 0.2
                    },
                    ticks: {
                        color: color1,
                        stepSize: 1,
                        callback: function(value, index, values) {
                            return value + ':00';
                        }
                    }
                }
            }
        }
    });
}

export default attendanceChart;