export let infoData = [
    {
        id: 'aboutLogin', 
        title: 'Login Menu', 
        imageSrc: './img/login.jpg', 
        mainDescription: 'Typical login page does it need any more explanation? ;)',
        descriptionList: [
            //bullets

        ]
    },
    {
        id: 'aboutMain',
        title: 'Main Menu',
        imageSrc: './img/main.jpg',
        mainDescription: 'Main menu is split into two parts: top and bottom. See pictures below for more details.',
        descriptionList: [
            'This page shows some useful information about databases and has some buttons that allow you to navigate through the app.',
            'THE MOST IMPORTANT thing about this page is that at the top right corner you see ON/OFFLINE INDICATOR. (I know it looks like a button, but it isn\'t; it might be a button in the future though ;)'
        ]
        
        
    },
    {
        id: 'aboutMainTop',
        title: 'Top Main Menu',
        imageSrc: './img/mainTop.jpg',
        mainDescription: 'Top of the main page has information about databases and some buttons.',
        descriptionList: [
            'Admin - information about who is currently logged in.',
            'Members Database - shows the version of the database with user\'s data that is currently loaded. (The number you see is the exact date and time of the newest added user/member to the database or the date of the most current edit to that database).',
            'Scan Database - Is the same as Members Database but for QR codes that have been scanned. (The app saves information about when each QR code was scanned and sends those details to the server. The number you see is the date and time of the most recent scan.)',
            'LOGOUT - button for logging out (The button deletes all information about the admin, user database, and scan database from this device. Next time you log in, you will have to download all databases again. But no worries, it will take about one second. Please let me know if it takes longer than that.)',
            'SUN/MOON button - allows you to change the screen mode from Bright to Dark and vice versa.',
            'ONLINE/OFFLINE INDICATOR - the most important thing about this is that it is not a button but an indicator. It shows if downloading databases was successful or not. (I know it looks like a button but it isn\'t; it might be a button in the future though ;)'
        ]
        
        
    },
    {
        id: 'aboutMainBottom',
        title: 'Bottom Main Menu',
        imageSrc: './img/mainBottom.jpg',
        mainDescription: 'Bottom of the main page with buttons.',
        descriptionList: [
            'REFRESH - refreshes the page and reloads databases. You can use it when you encounter problems with databases - sometimes it even helps ;)',
            'EDIT/ADD - allows you to edit and add users, redirecting you to another screen (Edit/Add).',
            'SEND QR - allows you to send QR codes to users via email. Redirects you to (Send QR).',
            'REPORTS - allows you to view reports about users\' payments and attendance. When you click it, you will be redirected to (Reports).',
            'SCAN CODE - allows you to scan QR codes. Redirects you to another page (Scan QR).',
        ]
        
        
    },
    {
        id: 'selectForEdit',
        title: 'Select user for editing',
        imageSrc: './img/selectForEdit.jpg',
        mainDescription: 'Selecting users for editing and adding user data.',
        descriptionList: [
            'Select a user from the list and click the EDIT button to edit their data.',
            'If you don\'t select any user, the EDIT button will be disabled.',
            'You can select only one user at a time.',
            'Sorting users by name, surname, or by ID is possible.'
        ]
    },
    {
        id: 'aboutAdd',
        title: 'Adding new user',
        imageSrc: './img/add.jpg',
        mainDescription: 'Straightforward form for editing and adding user data.',
        descriptionList: [
            'You can add users by filling out the form and clicking the ADD button.',
            'Notice that when you add a new user, there is no ID number in the top right corner.',
            'The ID number is generated automatically.',
            'The default payment date is the current date.'
        ]
    },
    {
        id: 'aboutEdit',
        title: 'Edit user\'s data',
        imageSrc: './img/edit.jpg',
        mainDescription: 'You can edit user data by filling out the form and clicking the EDIT button.',
        descriptionList: [
            'Notice that you can\'t change the user\'s ID; you can only change their data.',
            'You can see the user ID in the top right corner of the screen.'
        ]        
    },
    {
        id: 'aboutSendQR',
        title: 'Sending QR codes',
        imageSrc: './img/snedQR.jpg',
        mainDescription: 'This page lets you send QR codes to users via email.',
        descriptionList: [
            'You can select users from the list and click the SEND button.',
            'Multiple users can be selected.',
            'Sorting users by name, surname, or by ID is possible.'
        ]        
    },
    {
        id: 'aboutScanning1',
        title: 'Scanning QR codes',
        imageSrc: './img/scanning1.jpg',
        mainDescription: 'Before you can scan a QR code, you\'ll see this screen.',
        descriptionList: [
            'Scanning won\'t start until you click the START SCANNING button.',
            '...then your web browser will ask you for permission to use your camera.',
            'This view can be displayed vertically or horizontally depending on your device and its position. If something is not right, try to rotate your device.'
        ]
        
    },
    {
        id: 'aboutScanning2',
        title: 'Scanning QR codes in HORIZONTAL VIEW',
        imageSrc: './img/scanning2.jpg',
        mainDescription: 'This is how the scanning view should look when your device is in a horizontal position.',
        descriptionList: [
            'The view should be split into two parts: the left part is for scanning, and the right part is for displaying the result.',
            'Left part - scanning area. When you point your camera at a QR code, the app will try to scan it.',
            'On the left part, you also have two buttons: STOP SCANNING and SWITCH CAMERA.',
            'The SWITCH CAMERA button allows you to switch between the front and back cameras.',
            'Right part - result area. When the app scans a QR code, it will display the result here.',
            'Top right side - information about the database of users. The scans are going to be verified against this database.',
            'When the code is scanned, the data will check if the scanned user is currently in the database, and if not, it will display a corresponding message.',
            'Results of scanning should contain the following information: user ID, user name, user surname, scan time, and a DOT (green or yellow).',
            'The DOT indicates if the current scan has been sent to the server correctly.',
            'Just after scanning, the DOT should be yellow. After sending it to the server, it should change to green.',
            'To send scans to the server, you should press the \'Send scans to server\' button in the bottom right corner of the screen.',
            'When all scans are sent to the server, you can safely clear the scan database by pressing the \'Clear scanned list.\''
        ]
        
        
    },
    {
        id: 'aboutScanning3',
        title: 'Scanning QR codes in VERTICAL VIEW',
        imageSrc: './img/scanning3.jpg',
        mainDescription: 'Basicaly this view is the same as the horizontal view, but it is displayed vertically.',
        descriptionList: [
            'Please use this picture to see how the view should look like when your device is in a vertical position.'
        ]
    },
    {
        id: 'aboutReports',
        title: 'Repots Menu',
        imageSrc: './img/reports.jpg',
        mainDescription: 'This screen allows you to choose what report you want to see.',
        descriptionList: [
            'You have two options: Payment Status and Attendance Report.',
            'Payment Status - shows you the payment status of all users.',
            'Attendance Report - shows you attendance reports for all users.'
        ]
    },
    {
        id: 'aboutPaymentStatus',
        title: 'Payment Status',
        imageSrc: './img/paymentStatus.jpg',
        mainDescription: 'This table shows information about users\' payments.',
        descriptionList: [
            'ID, Name, Surname - basic user information.',
            'Paid Amount - shows how much money the user has paid. You can edit this value by clicking on the Edit button at the end of the row or edit this user from the main menu.',
            'Paid Date - shows the date of the payment. You can edit this value by clicking on the Edit button at the end of the row or edit this user from the main menu.',
            'Days Since Paid - shows how many days have passed since the payment date. (If the number is negative, it means that the user\'s paid date is set in the future.)',
            'If the number of Days since Paid is greater than 30, the row is highlighted in red.',
            'Last Scan - shows the date of the last time the user with those credentials was last scanned.',
            'Remind - button that allows you to send a predetermined email to the user with a reminder about payment.',
            'Edit - button that allows you to edit user details. - It will redirect you to the edit screen.'
        ]
        
    },
    {
        id: 'aboutAttendanceReport1',
        title: 'Table Report',
        imageSrc: './img/attendanceReport1.jpg',
        mainDescription: 'After clicking Attendance Report, you are presented with a table and bubble chart.', 
        descriptionList: [
            'Attendance separated by days of the week and hours in a particular time period.',
            'Rows in which there are no scans are not shown.',
            'You can change the time period by clicking on the date in the top right corner of the screen.',
            'You can also change if you want to see attendance for all users or only for a selected user.',
            'Notice each table cell has a number in it. This number is the count of scans in that particular day and hour.',
            'Table cells have a visual representation of the amount of scans; the bigger the number, the bigger the indicator. - But you can switch them off by ticking \'Show visual indicators\' checkbox.'
        ]        
    },
    {
        id: 'aboutAttendanceReport2',
        title: 'Bubble Chart',
        imageSrc: './img/attendanceReport2.jpg',
        mainDescription: 'After clicking Attendance Report, you\'ll see a convenient bubble chart.',
        descriptionList: [
            'Convenient way to see attendance in a particular time period.',
            'Bubble chart represents the same data as the table but in a more visual way.',
            'The bigger the bubble, the more scans in that particular day and hour.',
            'Rows in which there are no scans are not shown.'
        ]
    }
];
