import { Subject, Observable } from 'rxjs';

export class DynamicString {
    private str = new Subject<string>();

    constructor() {
    }

    get() {
        return this.str.asObservable();
    }

    set(input: string) {
        this.str.next(input);
    }
}

export class Text {
    dialog: {
        ok: DynamicString;
        cancel: DynamicString;
        clear: DynamicString;
        confirm: DynamicString;
    };
    loading: {
        initialize: DynamicString;
    };
    login: {
        header: DynamicString;
        button: DynamicString;
        createKeyButton: DynamicString;
    };
    tabs: {
        home: DynamicString;
        record: DynamicString;
        journal: DynamicString;
        feed: DynamicString;
    };
    sideMenu: {
        header: DynamicString;
        profile: DynamicString;
        privacy: DynamicString;
        about: DynamicString;
        help: DynamicString;
        version: DynamicString;
        signOutButton: DynamicString;
    };
    profile: {
        header: DynamicString;
        changeProfilePictureButton: DynamicString;
        firstName: DynamicString;
        lastName: DynamicString;
        email: DynamicString;
        birthday: DynamicString;
        gender: DynamicString;
        nationality: DynamicString;
        city: DynamicString;
        updateButton: DynamicString;
        preferNotToShow: DynamicString;
        male: DynamicString;
        female: DynamicString;
        nonbinary: DynamicString;
        language: DynamicString;
    };
    privacy: {
        header: DynamicString;
        backButton: DynamicString;
    };
    about: {
        header: DynamicString;
    };
    help: {
        header: DynamicString;
        tourP1Title: DynamicString;
        tourP1Desc: DynamicString;
        tourP2Title: DynamicString;
        tourP2Desc: DynamicString;
        tourP3Title: DynamicString;
        tourP3Desc: DynamicString;
        tourP4Title: DynamicString;
        tourP4Desc: DynamicString;
        tourP5Title: DynamicString;
        tourP5Desc: DynamicString;
        continue: DynamicString;
    };
    home: {
        header: DynamicString;
        title: DynamicString;
  
            blood: DynamicString;
            body: DynamicString;
            event: DynamicString;
            config: DynamicString;
   

    };
    visualization: {
        weekDays: {
            sun: DynamicString;
            mon: DynamicString;
            tue: DynamicString;
            wed: DynamicString;
            thu: DynamicString;
            fri: DynamicString;
            sat: DynamicString;
        };
        shareButton: DynamicString;
        barChart: {
            header: DynamicString;
            inLast7Days: DynamicString;
            today: DynamicString;
            average: DynamicString;
            max: DynamicString;
            min: DynamicString;
        };
        scatterPlot: {
            header: DynamicString;
            dataOfPast: DynamicString;
        }
    };
    dataReport: {
        notAvailable: DynamicString;
        temperature: DynamicString;
        AQ: DynamicString;
        AQI: DynamicString;
        AQIStatus: {
            good: DynamicString;
            moderate: DynamicString;
            unhealthy: DynamicString;
            veryUnhealthy: DynamicString;
            hazardous: DynamicString;
            unknown: DynamicString;
        };
        humidity: DynamicString;
        wokeUpTime: DynamicString;
        sleepingTime: DynamicString;
        hrs: DynamicString;
        steps: DynamicString;
        indoor: DynamicString;
        outdoor: DynamicString;
        addCustomClassButton: DynamicString;
        shareButton: DynamicString;
    };
    addDataClass: {
        header: DynamicString;
        name: DynamicString;
        expectedMin: DynamicString;
        expectedMax: DynamicString;
        interval: DynamicString;
        unit: DynamicString;
        calories: DynamicString;
        kcal: DynamicString;
        doneButton: DynamicString;
    };
    record: {
        header: DynamicString;
        sensors: DynamicString;
        pedometer: DynamicString;
        location: DynamicString;
        gyroscope: DynamicString;
        beta: DynamicString;
        customClass: DynamicString;
        updateButton: DynamicString;
    };
    journal: {
        header: DynamicString;
        activity: DynamicString;
    };
    feed: {
        header: DynamicString;
        msg: DynamicString;
    };

    constructor() {
        this.dialog = {
            ok: new DynamicString(),
            cancel: new DynamicString(),
            clear: new DynamicString(),
            confirm: new DynamicString(),
        };
        this.loading = {
            initialize: new DynamicString(),
        };
        this.login = {
            header: new DynamicString(),
            button: new DynamicString(),
            createKeyButton: new DynamicString()
        };
        this.tabs = {
            home: new DynamicString(),
            record: new DynamicString(),
            journal: new DynamicString(),
            feed: new DynamicString(),
        };
        this.sideMenu = {
            header: new DynamicString(),
            profile: new DynamicString(),
            privacy: new DynamicString(),
            about: new DynamicString(),
            help: new DynamicString(),
            version: new DynamicString(),
            signOutButton: new DynamicString(),
        };
        this.profile = {
            header: new DynamicString(),
            changeProfilePictureButton: new DynamicString(),
            firstName: new DynamicString(),
            lastName: new DynamicString(),
            email: new DynamicString(),
            birthday: new DynamicString(),
            gender: new DynamicString(),
            nationality: new DynamicString(),
            city: new DynamicString(),
            updateButton: new DynamicString(),
            preferNotToShow: new DynamicString(),
            male: new DynamicString(),
            female: new DynamicString(),
            nonbinary: new DynamicString(),
            language: new DynamicString(),
        };
        this.privacy = {
            header: new DynamicString(),
            backButton: new DynamicString(),
        };
        this.about = {
            header: new DynamicString(),
        };
        this.help = {
            header: new DynamicString(),
            tourP1Title: new DynamicString(),
            tourP1Desc: new DynamicString(),
            tourP2Title: new DynamicString(),
            tourP2Desc: new DynamicString(),
            tourP3Title: new DynamicString(),
            tourP3Desc: new DynamicString(),
            tourP4Title: new DynamicString(),
            tourP4Desc: new DynamicString(),
            tourP5Title: new DynamicString(),
            tourP5Desc: new DynamicString(),
            continue: new DynamicString(),
        };
        this.home = {
            header: new DynamicString(),
            title: new DynamicString(),
           
                blood: new DynamicString(),
                body: new DynamicString(),
                event: new DynamicString(),
                config: new DynamicString(),
        

        };
        this.visualization = {
            weekDays: {
                sun: new DynamicString(),
                mon: new DynamicString(),
                tue: new DynamicString(),
                wed: new DynamicString(),
                thu: new DynamicString(),
                fri: new DynamicString(),
                sat: new DynamicString(),
            },
            shareButton: new DynamicString(),
            barChart: {
                header: new DynamicString(),
                inLast7Days: new DynamicString(),
                today: new DynamicString(),
                average: new DynamicString(),
                max: new DynamicString(),
                min: new DynamicString(),
            },
            scatterPlot: {
                header: new DynamicString(),
                dataOfPast: new DynamicString(),
            }
        };
        this.dataReport = {
            notAvailable: new DynamicString(),
            temperature: new DynamicString(),
            AQ: new DynamicString(),
            AQI: new DynamicString(),
            AQIStatus: {
                good: new DynamicString(),
                moderate: new DynamicString(),
                unhealthy: new DynamicString(),
                veryUnhealthy: new DynamicString(),
                hazardous: new DynamicString(),
                unknown: new DynamicString(),
            },
            humidity: new DynamicString(),
            wokeUpTime: new DynamicString(),
            sleepingTime: new DynamicString(),
            hrs: new DynamicString(),
            steps: new DynamicString(),
            indoor: new DynamicString(),
            outdoor: new DynamicString(),
            addCustomClassButton: new DynamicString(),
            shareButton: new DynamicString(),
        };
        this.addDataClass = {
            header: new DynamicString(),
            name: new DynamicString(),
            expectedMax: new DynamicString(),
            expectedMin: new DynamicString(),
            interval: new DynamicString(),
            unit: new DynamicString(),
            calories: new DynamicString(),
            kcal: new DynamicString(),
            doneButton: new DynamicString(),
        };
        this.record = {
            header: new DynamicString(),
            sensors: new DynamicString(),
            pedometer: new DynamicString(),
            location: new DynamicString(),
            gyroscope: new DynamicString(),
            beta: new DynamicString(),
            customClass: new DynamicString(),
            updateButton: new DynamicString(),
        };
        this.journal = {
            header: new DynamicString(),
            activity: new DynamicString(),
        };
        this.feed = {
            header: new DynamicString(),
            msg: new DynamicString(),
        };
    }
}
