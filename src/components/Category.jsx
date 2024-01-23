import { useContext, useEffect, useRef } from "react";
import { GlobalContext } from "./GlobalContext";

import oval from '../../public/images/oval.svg'
import doingOval from '../../public/images/doingOval.svg'
import doneOval from '../../public/images/doneOval.svg'
import { NavLink } from "react-router-dom";

import board from '../../public/images/board.svg'
import dark from '../../public/images/nightmode.svg'
import light from '../../public/images/lightmode.svg'
import eye from '../../public/images/eye.svg'

import Delete from '../../public/images/delete.svg'


function Category(){

    const { theme , setTheme , data , setCurrentBoard , currentBoard , todos ,setTodos} = useContext(GlobalContext);

    const dialogRef = useRef(null);
    const inputRef = useRef(null);
    console.log(Array.isArray(todos));
    
    // const veri = todos[0].panolar.filter( data => data.isim === currentBoard.replace('-',' '));
    const indexBoard = todos[0].panolar.findIndex((data) => data.isim === currentBoard.replace('-', ' '));

    if (indexBoard !== -1) {
    console.log("İndex Numarası: ", indexBoard);
    } else {
    console.log("Panoya ait öğe bulunamadı.");
    }

    useEffect(() => {
        BoardList();
        TodoList();
    },[currentBoard]);

    function todosil() {
        // 'todos' isimli bir dizi olduğunu varsayalım
        const silinecekIndex = 0; // Kaldırmak istediğiniz öğenin dizideki indisini belirtin
    
        // Dizi içindeki öğeyi kaldırma
        todos[0].panolar[0].sutunlar[0].gorevler.splice(silinecekIndex, 1);
    
        // Dizi boyutu ve uzunluğu güncellendi
        console.log(todos[0].panolar[0].sutunlar[0].gorevler.length);
    }

        // Bir görevi bir sütundan diğerine taşımak için bir fonksiyon
    function goreviTasi(sutunKaynak, sutunHedef, gorevIndex) {
        // Belirtilen indeksteki görevi kaynaktan kaldır
        const [tasinanGorev] = sutunKaynak.gorevler.splice(gorevIndex, 1);

        // Hedef sütununa görevi ekle
        sutunHedef.gorevler.push(tasinanGorev);
    }

    // Örnek: "Yapılacak" sütunundan "Yapılıyor" sütununa bir görevi taşı
    // goreviTasi(todos[0].panolar[0].sutunlar[0], todos[0].panolar[0].sutunlar[1], 0);

    function sidebarHandleTheme(){
        if(theme === 'dark'){
          setTheme('light');
        }else{
          setTheme('dark');
        }
        document.documentElement.classList.toggle('dark');
    }

    function handleSidebar(ev){
      ev.target.parentElement.parentElement.children[0].classList.toggle('sidebar-hidden');
      ev.target.parentElement.parentElement.children[0].classList.toggle('sidebar-block');
    }

    function openColumnModal(){
      dialogRef.current.showModal();
    }

    function closeColumnModal(ev){
        inputRef.current.value = ''; 
        dialogRef.current.close();
    }

    function BoardList(){
        return(todos[0].panolar.map(((data , index) => 
        <NavLink onClick={() => selectedBoard(data.isim)} key={index} to={'/' + data.isim.replace(/\s+/g,'-')} className="boardCategory">
            <img src={board} alt="" />
            <h1>{data.isim}</h1>
        </NavLink>)))
    }

    function selectedBoard(selectBoard){
        setCurrentBoard(selectBoard);
    }
    console.log(currentBoard);

    function TodoList(){
        
        return(todos[0].panolar.filter(data => data.isim === currentBoard.replace('-',' ')).map((data => data.sutunlar.map( (data , index) =>
        <div key={index} className="todoList">
            <div className="todoHead">
                <img src={doingOval} alt="" />
                <h1>{data.isim} {'(' + data.gorevler.length + ')'}</h1>
            </div>
            {(data.gorevler.map( (data , index) => 
            <div draggable key={index} className={theme + "Todo cursor"} id={theme + 'Todo'}>
                <h1>{data.baslik}</h1>
            </div>))}
        </div>))))
    }

    function newBoard(e){
        todos;
        e.preventDefault();
        const boardData = Object.fromEntries(new FormData(e.target));
        console.log(boardData);

        boardData.title = boardData.title.replace('ı','i');
        boardData.title = boardData.title.replace('ş','s');
        boardData.title = boardData.title.replace('ç','c');
        boardData.title = boardData.title.replace('ö','o');
        boardData.title = boardData.title.replace('ğ','g');
        boardData.title = boardData.title.replace('ü','u');

        const yeniPano = 
        {isim: boardData.title,
        sutunlar: [
        {
            isim: "Yapılacak",
            gorevler: []
        },
        {
            isim: "Yapılıyor",
            gorevler: []
        },
        {
            isim: "Bitti",
            gorevler: []
        }
        ]};

        todos[0].panolar.push(yeniPano);
        setTodos(todos);
        // boardData.title = '';
        inputRef.current.value = '';
        BoardList();
        TodoList();
        closeColumnModal(boardData);
    }

    return(
        <>
            <div className="container">
                <div className={theme + "Sidebar sidebar-block"} id={theme + 'Sidebar'}>
                    <div className="boardList">
                        <BoardList />
                        <div onClick={() => openColumnModal()} className="newCategory cursor hover">
                            <img src={board} alt="" />
                            <h1>+ Yeni Sütun Oluştur</h1>
                        </div>
                            <dialog ref={dialogRef} className={theme + 'AddTaskDialog'} id={theme + 'AddTaskDialog'}>
                                <form onSubmit={(e) => newBoard(e)} className='addNewTaskModal' autoComplete='off'>
                                    <div className="modalHead">
                                        <h1>Yeni Pano Oluştur</h1>
                                        <img src={Delete} className='closeModal cursor' onClick={(ev) => closeColumnModal(ev)} />
                                    </div>
                                    <div className={theme + "FormTitle"} id={theme + 'FormTitle'}>
                                        <h1>Pano Adı</h1>
                                        <input ref={inputRef} required type="text" name="title" id="addTitle" placeholder='Örnek: Market Planı' />
                                    </div>
                                    {/* <div className={theme + "FormTitle"} id={theme + 'FormTitle'}>
                                        <h1>Pano Sütunları</h1>
                                        <div className={theme + "BoardColumns"} id={theme + 'BoardColumns'}>
                                            <input type="text" name="title" id="addTitle" placeholder="ornek: Todo , Doing , Done" />
                                            <img src={Delete} className='closeModal cursor' onClick={(evAdd) => closeAddTask(evAdd)} />
                                        </div>
                                        <div className={theme + "BoardColumns"} id={theme + 'BoardColumns'}>
                                            <input type="text" name="title" id="addTitle" placeholder="ornek: Todo , Doing , Done" />
                                            <img src={Delete} className='closeModal cursor' onClick={(evAdd) => closeAddTask(evAdd)} />
                                        </div>
                                    </div> */}

                                    <div className="newBoardButton">
                                        {/* <button className='addButton hover' type="submit">+Add New Column</button> */}
                                        <button className='submit' type="submit">Create New Board</button>
                                    </div>
                                </form>
                            </dialog>
                        <div className={theme + "ThemeToggle"} id={theme + 'ThemeToggle'}>
                            <img src={light} alt="" />
                            <label className="toggle-switch">
                                <input type="checkbox"/>
                                    <div onClick={sidebarHandleTheme} className="toggle-switch-background">
                                    <div className="toggle-switch-handle"></div>
                                </div>
                            </label>
                            <img src={dark} alt="" />
                        </div>
                    </div>
                </div>

                <div className="">
                    <img className="handleSidebar cursor" onClick={(ev) => handleSidebar(ev)} src={eye} alt="" />
                </div>

                <div className="status">
                    <TodoList />
                </div>
            </div>
        </>
    )
}

export default Category