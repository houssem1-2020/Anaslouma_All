import React, { useEffect, useState } from 'react';

const MyFunctionThemeMode = () => {

    let [themeMode , setTheme] = useState(localStorage.getItem('Magazin_Caisse_Theme'))
    useEffect(() => {
        window.addEventListener("storage", () => {
            setTheme(localStorage.getItem("Magazin_Caisse_Theme"));
        });
      }, []);

  return themeMode;
};

export default MyFunctionThemeMode;