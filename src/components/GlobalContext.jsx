import { createContext, useEffect, useState } from "react";
import data from '../data/todos.json'
import { useNavigate } from "react-router-dom";

export const GlobalContext = createContext();

export const GlobalProvider = (props) => {

    const [theme , setTheme] = useState('light');
    const [currentBoard , setCurrentBoard] = useState();

    
    const Navigate = useNavigate();

    const [todos , setTodos] = useState([
        {
            panolar: []
        }
    ]);
    
    
    function localDodos(){
        const dodos = JSON.parse(localStorage.getItem('dodos'));
        if(dodos){
            const dodo = dodos[0].panolar.length > 0;
            if(dodo){
                setTodos(dodos);
            }
        }else{
            return;
        }
    }

    useEffect(() => {
        console.log('parçacuk çalıştı');
        localDodos();
    },[setTodos])

    const content = (todos[0].panolar?.length > 0);

    useEffect(() => {
        if(content === true){
            setCurrentBoard(`${location.pathname?.replace('/','').replace('-',' ')}`);
        }else{
            setCurrentBoard('Dodo List');
        }   
    })
    
    return(
        <GlobalContext.Provider value={{ theme, setTheme , data , setCurrentBoard , currentBoard , todos , setTodos , content}}>
            {props.children}
        </GlobalContext.Provider>
    )
}




// const [todos , setTodos] = useState([
//     {
//         panolar: [
//             {
//                 isim: 'Proje Listesi',
//                 sutunlar: [
//                     {
//                         isim: 'Yapılacak',
//                         gorevler: [
//                             {
//                                 baslik: 'Kayıt akışı için kullanıcı arayüzü oluştur',
//                                 description: '',
//                                 durum: 'Yapılacak',
//                             }
//                         ]
//                     },
//                     {
//                         isim: "Yapılıyor",
//                         gorevler: []
//                     },
//                     {
//                         isim: "Bitti",
//                         gorevler: []
//                     }
//                 ],
//             },
            
//         ]
//     }
// ])  