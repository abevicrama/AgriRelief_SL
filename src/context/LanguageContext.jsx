import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export function useLanguage() {
    return useContext(LanguageContext);
}

const translations = {
    en: {
        home: "Home",
        reportDamage: "Report Damage",
        aidMap: "Aid Map",
        contactDept: "Contact Dept",
        adminDashboard: "Admin Dashboard",
        logout: "Logout",
        welcome: "Welcome to AgriRelief SL",
        loggedInAs: "Logged in as",
        role: "Role",
        startReport: "Start Report",
        viewMap: "View Map",
        myReports: "My Reports",
        // Form Translations
        damageReportForm: "Damage Report Form",
        reportSubtitle: "Report your farmland damage to request assistance.",
        locationDetails: "Location Details",
        province: "Province",
        district: "District",
        dsDivision: "DS Division",
        gnDivision: "GN Division",
        gpsLocation: "GPS Location (Required for Map)",
        useMyLocation: "Use My Location",
        damageDetails: "Damage Details",
        natureOfCultivation: "Nature of Cultivation",
        natureOfDamage: "Nature of Damage",
        landSize: "Land Size",
        severity: "Severity",
        assistanceRequired: "Assistance Required",
        immediateNeeds: "Immediate Needs",
        markAsUrgent: "Mark as Urgent (Critical Situation)",
        contactNumber: "Contact Number",
        uploadPhotos: "Upload Photos (2-3)",
        submitReport: "Submit Report",
        selectProvince: "Select Province",
        selectDistrict: "Select District",
        selectType: "Select Type",
        selectDamage: "Select Damage",
        selectSeverity: "Select Severity",
        uploadFile: "Upload a file",
        dragDrop: "or drag and drop",
        fileLimit: "PNG, JPG, GIF up to 10MB",
        filesSelected: "file(s) selected",
        captured: "Captured",
        unableToRetrieveLocation: "Unable to retrieve your location.",
        geolocationNotSupported: "Geolocation is not supported by this browser.",
        reportSubmitted: "Report submitted successfully!",
        reportFailed: "Failed to submit report. Please try again.",
    },
    si: {
        home: "මුල් පිටුව",
        reportDamage: "හානි වාර්තා කරන්න",
        aidMap: "ආධාර සිතියම",
        contactDept: "දෙපාර්තමේන්තුව අමතන්න",
        adminDashboard: "පරිපාලන පුවරුව",
        logout: "ඉවත් වන්න",
        welcome: "AgriRelief SL වෙත සාදරයෙන් පිළිගනිමු",
        loggedInAs: "ලොග් වී ඇත්තේ",
        role: "භූමිකාව",
        startReport: "වාර්තාව අරඹන්න",
        viewMap: "සිතියම බලන්න",
        myReports: "මගේ වාර්තා",

        // Form Translations
        damageReportForm: "හානි වාර්තා කිරීමේ පෝරමය",
        reportSubtitle: "ආධාර ඉල්ලීම සඳහා ඔබේ ගොවිබිම් හානි වාර්තා කරන්න.",
        locationDetails: "ස්ථාන විස්තර",
        province: "පළාත",
        district: "දිස්ත්‍රික්කය",
        dsDivision: "ප්‍රා.ලේ. කොට්ඨාසය",
        gnDivision: "ග්‍රා.නි. වසම",
        gpsLocation: "GPS ස්ථානය (සිතියම සඳහා අවශ්‍යයි)",
        useMyLocation: "මගේ ස්ථානය භාවිතා කරන්න",
        damageDetails: "හානි විස්තර",
        natureOfCultivation: "වගාවේ ස්වභාවය",
        natureOfDamage: "හානියේ ස්වභාවය",
        landSize: "ඉඩම් ප්‍රමාණය",
        severity: "බරපතලකම",
        assistanceRequired: "අවශ්‍ය ආධාර",
        immediateNeeds: "ක්ෂණික අවශ්‍යතා",
        markAsUrgent: "හදිසි ලෙස සලකුණු කරන්න (අවදානම් තත්ත්වය)",
        contactNumber: "සම්බන්ධතා අංකය",
        uploadPhotos: "ඡායාරූප උඩුගත කරන්න (2-3)",
        submitReport: "වාර්තාව ඉදිරිපත් කරන්න",
        selectProvince: "පළාත තෝරන්න",
        selectDistrict: "දිස්ත්‍රික්කය තෝරන්න",
        selectType: "වර්ගය තෝරන්න",
        selectDamage: "හානිය තෝරන්න",
        selectSeverity: "බරපතලකම තෝරන්න",
        uploadFile: "ගොනුවක් උඩුගත කරන්න",
        dragDrop: "හෝ ඇද දමන්න",
        fileLimit: "PNG, JPG, GIF 10MB දක්වා",
        filesSelected: "ගොනු තෝරා ඇත",
        captured: "ලබා ගත්තා",
        unableToRetrieveLocation: "ඔබගේ ස්ථානය ලබා ගැනීමට නොහැක.",
        geolocationNotSupported: "මෙම බ්‍රව්සරය Geolocation සඳහා සහය නොදක්වයි.",
        reportSubmitted: "වාර්තාව සාර්ථකව ඉදිරිපත් කරන ලදී!",
        reportFailed: "වාර්තාව ඉදිරිපත් කිරීමට අසමත් විය. කරුණාකර නැවත උත්සාහ කරන්න.",
    },
    ta: {
        home: "முகப்பு",
        reportDamage: "சேதத்தை புகாரளிக்கவும்",
        aidMap: "உதவி வரைபடம்",
        contactDept: "திணைக்களத்தை தொடர்பு கொள்ளவும்",
        adminDashboard: "நிர்வாக குழு",
        logout: "வெளியேறு",
        welcome: "AgriRelief SL க்கு வரவேற்கிறோம்",
        loggedInAs: "உள்நுழைந்துள்ளது",
        role: "பங்கு",
        startReport: "அறிக்கையைத் தொடங்கவும்",
        viewMap: "வரைபடத்தைப் பார்க்கவும்",
        myReports: "எனது அறிக்கைகள்",

        // Form Translations
        damageReportForm: "சேத அறிக்கை படிவம்",
        reportSubtitle: "உதவி கோர உங்கள் விவசாய நில சேதத்தை புகாரளிக்கவும்.",
        locationDetails: "இடம் விவரங்கள்",
        province: "மாகாணம்",
        district: "மாவட்டம்",
        dsDivision: "பிரதேச செயலக பிரிவு",
        gnDivision: "கிராம சேவகர் பிரிவு",
        gpsLocation: "GPS இடம் (வரைபடத்திற்கு தேவை)",
        useMyLocation: "எனது இருப்பிடத்தைப் பயன்படுத்தவும்",
        damageDetails: "சேத விவரங்கள்",
        natureOfCultivation: "பயிரின் தன்மை",
        natureOfDamage: "சேதத்தின் தன்மை",
        landSize: "நில அளவு",
        severity: "தீவிரம்",
        assistanceRequired: "தேவையான உதவி",
        immediateNeeds: "உடனடி தேவைகள்",
        markAsUrgent: "அவசரமாக குறிக்கவும் (முக்கியமான நிலைமை)",
        contactNumber: "தொடர்பு எண்",
        uploadPhotos: "புகைப்படங்களை பதிவேற்றவும் (2-3)",
        submitReport: "அறிக்கையை சமர்ப்பிக்கவும்",
        selectProvince: "மாகாணத்தைத் தேர்ந்தெடுக்கவும்",
        selectDistrict: "மாவட்டத்தைத் தேர்ந்தெடுக்கவும்",
        selectType: "வகையைத் தேர்ந்தெடுக்கவும்",
        selectDamage: "சேதத்தைத் தேர்ந்தெடுக்கவும்",
        selectSeverity: "தீவிரத்தைத் தேர்ந்தெடுக்கவும்",
        uploadFile: "கோப்பை பதிவேற்றவும்",
        dragDrop: "அல்லது இழுத்து விடவும்",
        fileLimit: "PNG, JPG, GIF 10MB வரை",
        filesSelected: "கோப்புகள் தேர்ந்தெடுக்கப்பட்டன",
        captured: "கைப்பற்றப்பட்டது",
        unableToRetrieveLocation: "உங்கள் இருப்பிடத்தை மீட்டெடுக்க முடியவில்லை.",
        geolocationNotSupported: "இந்த உலாவி Geolocation ஐ ஆதரிக்கவில்லை.",
        reportSubmitted: "அறிக்கை வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!",
        reportFailed: "அறிக்கையை சமர்ப்பிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
    }
};

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

    const switchLanguage = (lang) => {
        setLanguage(lang);
        localStorage.setItem('language', lang);
    };

    const t = (key) => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, switchLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}
