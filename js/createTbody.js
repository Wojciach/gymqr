function createTbody(database, newStamps) {
    return `
        <tbody>
            ${database.map(user =>  {
                const lastScan = newStamps[user.id] || "N/D";
                const daysSincePaid = Math.floor((new Date() - new Date(user.paidDate)) / (1000 * 60 * 60 * 24));
                return`
                <tr>
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.surname}</td>
                    <td>${user.paidAmount}</td>
                    <td>${user.paidDate}</td>
                    <td>${daysSincePaid}</td>
                    <td>${lastScan}</td>
                    <td class="remind">Remind</td>
                    <td class="edit">Edit</td>
                </tr>
                `}).join("")}
        </tbody>
    `;
}

export default createTbody;