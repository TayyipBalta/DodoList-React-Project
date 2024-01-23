import { Link , Outlet, useLocation, useNavigate} from "react-router-dom";
import Category from "./Category";
import { useContext, useEffect, useRef, useState } from "react";
import { GlobalContext } from "./GlobalContext";
import { NavLink } from "react-router-dom";

import oval from '../../public/images/oval.svg'
import doingOval from '../../public/images/doingOval.svg'
import doneOval from '../../public/images/doneOval.svg'
import board from '../../public/images/board.svg'
import dark from '../../public/images/nightmode.svg'
import light from '../../public/images/lightmode.svg'
import eye from '../../public/images/eye.svg'
import Close from '../../public/images/delete.svg'
import threedot from '../../public/images/threedot.svg'

function Board(){

    const { theme , setTheme , data , setCurrentBoard , currentBoard , todos , setTodos , content} = useContext(GlobalContext);
    const [selectedTask , setSelectedTask] = useState(null);
    const [selectTaskIndex , setSelectTaskIndex] = useState(null);
    const [selectColumnIndex , setSelectColumnIndex] = useState(null);
    const [statusTargetNumber , setTargetStatus] = useState(null);
    const [statusTargetString , setTargetString] = useState(null);

    const location = useLocation();
    const Navigate = useNavigate();

    const inputRef = useRef(null);
    const boardInputRef = useRef(null);

    const dialogRef = useRef(null);
    const detailRef = useRef(null);
    const addBoardRef = useRef(null);
    const taskStatusRef = useRef(null);
    const taskEditAndDeleteRef = useRef(null);
    const deleteTaskRef = useRef(null);

    console.log(Array.isArray(todos));
    
    const indexBoard = todos[0].panolar.findIndex((data) => data.isim === currentBoard.replace('-', ' '));

    if (indexBoard !== -1) {
    console.log("İndex Numarası: ", indexBoard);
    } else {
    console.log("Pano boş gibi gibi");
    }
    
    useEffect(() => {
        console.log('parçacuk çalıştı');
        setCurrentBoard(location.pathname?.replace('/','').replace('-',' '));
        setSelectedTask(null);
        setSelectTaskIndex(null);
        setSelectColumnIndex(null);
        setTargetStatus(null);
        setTargetString(null);
        BoardList();
        TodoList();
    },[location.pathname , todos]);

    console.log(JSON.parse(localStorage.getItem('dodos')));

    function deleteTask() {
        console.log(statusTargetNumber);
        console.log(selectTaskIndex);
        console.log(selectColumnIndex);
        setTodos((prevDodos) => {
            const newDodos = [...prevDodos];
            newDodos[0].panolar[indexBoard].sutunlar[selectColumnIndex].gorevler.splice(selectTaskIndex, 1);
            localStorage.setItem('dodos' , JSON.stringify(newDodos));
            return newDodos;
        })
    }

    function sidebarHandleTheme(){
        if(theme === 'dark'){
          setTheme('light');
        }else{
          setTheme('dark');
        }
        document.documentElement.classList.toggle('dark');
    }

    useEffect(() => {
        if(selectedTask !== null){
            detailRef.current.showModal();
            todos[0].panolar.forEach((pano, indexPano) => {
                pano.sutunlar.forEach((sutun, indexSutun) => {
                    sutun.gorevler.forEach((gorev, indexGorev) => {
                        if (gorev.baslik === selectedTask.baslik) {
                            setSelectTaskIndex((prevIndex) => indexGorev);
                            setSelectColumnIndex((prevIndex) => indexSutun);
                        }
                    });
                });
            });
        }
    },[currentBoard , selectedTask , statusTargetNumber , selectTaskIndex])

    function handleSidebar(ev){
      ev.target.parentElement.parentElement.children[0].classList.toggle('sidebar-hidden');
      ev.target.parentElement.parentElement.children[0].classList.toggle('sidebar-block');
    }

    function openColumnModal(){
      dialogRef.current.showModal();
    }
    
    function openBoardModal(){
        addBoardRef.current.showModal();
    }
    function openDetailTask(data){
        setSelectedTask((prevData) => data);
    }
    function openTaskEditAndDelete(){
        taskEditAndDeleteRef.current.classList.toggle('display-hidden');
        taskEditAndDeleteRef.current.classList.toggle('display-block');
    }
    function openTaskEdit(ev){
        taskEditAndDeleteRef.current.classList.toggle('display-hidden');
        taskEditAndDeleteRef.current.classList.toggle('display-block');
        ev.target.parentElement.parentElement.parentElement.children[3].showModal();
        ev.target.parentElement.parentElement.parentElement.children[3].children[0].title.value = selectedTask.baslik;
        ev.target.parentElement.parentElement.parentElement.children[3].children[0].description.value = selectedTask.aciklama;
    }
    function openTaskDelete(){
        taskEditAndDeleteRef.current.classList.toggle('display-hidden');
        taskEditAndDeleteRef.current.classList.toggle('display-block');
        deleteTaskRef.current.showModal();
    }

    function closeColumnModal(ev){
        boardInputRef.current.title.value = '';
        dialogRef.current.close();
    }

    function closeBoardModal(){
        inputRef.current.value = '';
        addBoardRef.current.close();
    }
    function closeDetailTask(){
        setSelectedTask(null);
        detailRef.current.close();
    }
    function closeTaskEdit(ev){
        ev.target.parentElement.parentElement.parentElement.close();
        ev.target.parentElement.parentElement.title.value = '';
        ev.target.parentElement.parentElement.description.value = '';
    }
    function closeTaskDelete(){
        deleteTaskRef.current.close();
    }
    
    function moveTask(){
        console.log(taskStatusRef.current.value);

        setTargetString((prevStatus) => taskStatusRef.current.value);

        switch(taskStatusRef.current.value){
            case 'Yapılacak':
                setTargetStatus((prevNumber) => 0);
                break;
            case 'Yapılıyor':
                setTargetStatus((prevNumber) => 1);
                break;
            case 'Bitti':
                setTargetStatus((prevNumber) => 2);
        }
        console.log(statusTargetNumber);
    }
    useEffect(() => {
        if(statusTargetNumber !== null){
            setTodos((prevDodos) => {
            const newData = [...prevDodos];
            const moveTask = newData[0].panolar[indexBoard].sutunlar[selectColumnIndex].gorevler.splice(selectTaskIndex , 1)[0];
            moveTask.durum = statusTargetString;
            moveTask.statusID = statusTargetNumber;
            newData[0].panolar[indexBoard].sutunlar[statusTargetNumber].gorevler.push(moveTask);
            localStorage.setItem('dodos' , JSON.stringify(newData));
            return newData;
            })
            setTargetStatus((prev) => null);
            setTargetString((prev) => null);
        }
    },[statusTargetNumber])

    function editTask(ev){
        ev.preventDefault();
        const editTaskData = Object.fromEntries(new FormData(ev.target));
        
        let taskStatus;
        if(editTaskData.status === 'Yapılacak'){
            taskStatus = 0;
        }else if(editTaskData.status === 'Yapılıyor'){
            taskStatus = 1;
        }else if(editTaskData.status === 'Bitti'){
            taskStatus = 2;
        }

        editTaskData.title = editTaskData.title.replace(/\b\w/g, match => match.toUpperCase());

        setTodos((prevDodos) => {
            const newData = [...prevDodos];
            const editData = newData[0].panolar[indexBoard].sutunlar[selectColumnIndex].gorevler.splice(selectTaskIndex , 1)[0];
            editData.baslik = editTaskData.title;
            editData.aciklama = editTaskData.description;
            editData.durum = editTaskData.status;
            editData.statusID = taskStatus;
            newData[0].panolar[indexBoard].sutunlar[taskStatus].gorevler.push(editData);
            localStorage.setItem('dodos' , JSON.stringify(newData));
            return newData;
        })
        closeTaskEdit();
    }
    function newBoard(e){
        e.preventDefault();
        const boardData = Object.fromEntries(new FormData(e.target));
        console.log(boardData);

        boardData.title = boardData.title.replace(/[ışçöğü]/g, function(match) {
            switch (match) {
              case 'ı': return 'i';
              case 'ş': return 's';
              case 'ç': return 'c';
              case 'ö': return 'o';
              case 'ğ': return 'g';
              case 'ü': return 'u';
              default: return match;
            }
        });

        boardData.title = boardData.title.replace(/\b\w/g, match => match.toUpperCase());

        // boardData.title = boardData.title.replace('ı','i')
        // .replace('ş','s')
        // .replace('ç','c')
        // .replace('ö','o')
        // .replace('ğ','g')
        // .replace('ü','u');

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

        setTodos((prevDodos) => {
            const newDodos = [...prevDodos];
            newDodos[0].panolar.push(yeniPano);
            console.log(newDodos);
            localStorage.setItem('dodos', JSON.stringify(newDodos));
            return newDodos;
        });
        
        inputRef.current.value = '';
        closeColumnModal();
        closeBoardModal();
        Navigate('/' + boardData.title.replace(' ' , '-'));
    }

    function BoardList(){
        return(todos[0].panolar.map(((data , index) => 
        <NavLink onClick={() => selectedBoard({data , index})} key={index} itemID={index} to={'/' + data.isim.replace(/\s+/g,'-')} className="boardCategory">
            <img src={board} alt="" />
            <h1>{data.isim}</h1>
        </NavLink>)))
    }

    function selectedBoard({data , index}){
        setCurrentBoard(data.isim);
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
            <div onClick={() => openDetailTask(data)} draggable key={index} className={theme + "Todo cursor"} id={theme + 'Todo'}>
                <h1>{data.baslik}</h1>
            </div>))}
        </div>))))
    }

    function DetailTaskDialog({detailTask}){
        return(
            <>
                <dialog ref={detailRef} className={theme + "DetailModal"} id={theme + 'DetailModal'}>
                    <div className="modalHead">
                        <h1>Görev Detayı</h1>
                        <img src={Close} className='closeModal cursor' onClick={(evAdd) => closeDetailTask(evAdd)} />
                    </div>
                    <div className={theme + "DetailTitle"} id={theme + 'DetailTitle'}>
                        <div className="">
                            <h1>{detailTask?.baslik}</h1>
                        </div>
                        <div className="">
                            <img onClick={() => openTaskEditAndDelete()} className={content? 'cursor threedot' : 'hiddenTouch'} src={threedot} alt="" />
                        </div>
                    </div>
                    <dialog ref={taskEditAndDeleteRef} className={theme + 'TaskEditAndDelete display-hidden'} id={theme + 'TaskEditAndDelete'}>
                        <div className="editButtonBox">
                            <button onClick={(ev) => openTaskEdit(ev)} className='edit'>Düzenle</button>
                            <button onClick={() => openTaskDelete()} className='delete'>Sil</button>
                        </div>
                    </dialog>
                    <dialog className={theme + 'AddTaskDialog'} id={theme + 'AddTaskDialog'}>
                        <form onSubmit={(ev) => editTask(ev)} className='addNewTaskModal' autoComplete='off'>
                            <div className="modalHead">
                                <h1>Görevi Düzenle</h1>
                                <img src={Close} className='closeModal cursor' onClick={(ev) => closeTaskEdit(ev)} />
                            </div>
                            <div className={theme + "FormTitle"} id={theme + 'FormTitle'}>
                                <h1>Başlık</h1>
                                <input maxLength='34' type="text" name="title" id="addTitle" placeholder='Örnek: Markete git.' />
                            </div>
                            <div className={theme + "FormDescription"} id={theme + 'FormDescription'}>
                                <h1>Açıklama</h1>
                                <textarea type="text" name="description" id="addDesc" placeholder='Örnek: Domates , Biber , Patlıcan al.' />
                            </div>
                            <div className={theme + "FormStatus"} id={theme + 'FormStatus'}>
                                <h1>Statü</h1>
                                <select  name="status" className={theme + 'StatusOption'} id={theme + 'StatusOption'}>
                                    <option value='Yapılacak'>Yapılacak</option>
                                    <option value='Yapılıyor'>Yapılıyor</option>
                                    <option value='Bitti'>Bitti</option>
                                </select>
                            </div>
                            <button className='submit' type="submit">Kaydet</button>
                        </form>
                    </dialog>
                    <dialog className={theme + "DeleteTask"} id={theme + 'DeleteTask'} ref={deleteTaskRef}>
                        <div className={theme + "DeleteTask"} id={theme + 'DeleteTask'}>
                            <h1 className="color-red">Bu Görevi Sil?</h1>
                            <p className="color-red">{detailTask?.baslik}</p>
                            <p> görevini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.</p>
                            <div className="deleteButtonBox">
                                <button onClick={() => deleteTask()} className='delete'>Sil</button>
                                <button onClick={() => closeTaskDelete()} className='cancel'>Vazgeç</button>
                            </div>
                        </div>
                    </dialog>
                    <div className={theme + "DetailDescription"} id={theme + 'DetailDescription'}>
                        <p>{detailTask?.aciklama}</p>
                    </div>
                    <div className={theme + "DetailStatus"} id={theme + 'DetailStatus'}>
                        <h1>Statü</h1>
                        <select value={detailTask?.durum} ref={taskStatusRef} onChange={() => moveTask()} name="status" className={theme + 'StatusOption'} id={theme + 'StatusOption'}>
                            <option value='Yapılacak'>Yapılacak</option>
                            <option value='Yapılıyor'>Yapılıyor</option>
                            <option value='Bitti'>Bitti</option>
                        </select>
                    </div>
                </dialog>
            </>
        )
    }

    return(
        <>
        <div className="container">
                <div className={theme + "Sidebar sidebar-block"} id={theme + 'Sidebar'}>
                    <div className="boardList">
                        <BoardList />
                        <div onClick={() => openColumnModal()} className="newCategory cursor-cell hover">
                            <img src={board} alt="" />
                            <h1>+ Yeni Pano Oluştur</h1>
                        </div>
                            <dialog ref={dialogRef} className={theme + 'AddTaskDialog'} id={theme + 'AddTaskDialog'}>
                                <form ref={boardInputRef} onSubmit={(e) => newBoard(e)} className='addNewTaskModal' autoComplete='off'>
                                    <div className="modalHead">
                                        <h1>Yeni Pano Oluştur</h1>
                                        <img src={Close} className='closeModal cursor' onClick={(ev) => closeColumnModal(ev)} />
                                    </div>
                                    <div className={theme + "FormTitle"} id={theme + 'FormTitle'}>
                                        <h1>Pano Adı</h1>
                                        <input maxLength='17'  required type="text" name="title" id="addTitle" placeholder='Örnek: Market Planı' />
                                    </div>
                                    {/* <div className={theme + "FormTitle"} id={theme + 'FormTitle'}>
                                        <h1>Pano Sütunları</h1>
                                        <div className={theme + "BoardColumns"} id={theme + 'BoardColumns'}>
                                            <input type="text" name="title" id="addTitle" placeholder="ornek: Todo , Doing , Done" />
                                            <img src={Close} className='closeModal cursor' onClick={(evAdd) => closeAddTask(evAdd)} />
                                        </div>
                                        <div className={theme + "BoardColumns"} id={theme + 'BoardColumns'}>
                                            <input type="text" name="title" id="addTitle" placeholder="ornek: Todo , Doing , Done" />
                                            <img src={Close} className='closeModal cursor' onClick={(evAdd) => closeAddTask(evAdd)} />
                                        </div>
                                    </div> */}

                                    <div className="newBoardButton">
                                        {/* <button className='addButton hover' type="submit">+Add New Column</button> */}
                                        <button className='submit' type="submit">Yeni Pano Oluştur</button>
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

                    {content?    
                    <div className="status">
                        <TodoList />
                        <DetailTaskDialog detailTask={selectedTask} />
                    </div>
                        :
                    <div onClick={() => openBoardModal()} className="content">
                        <p>Bu tahta boş. Başlamak için yeni bir Pano oluşturun.</p>
                        <Link className='link'>+ Yeni Pano Ekle</Link>
                    </div>}
                    <dialog ref={addBoardRef} className={theme + 'AddTaskDialog'} id={theme + 'AddTaskDialog'}>
                        <form onSubmit={(e) => newBoard(e)} className='addNewTaskModal' autoComplete='off'>
                            <div className="modalHead">
                                <h1>Yeni Pano Oluştur</h1>
                                <img src={Close} className='closeModal cursor' onClick={(ev) => closeBoardModal(ev)} />
                            </div>
                            <div className={theme + "FormTitle"} id={theme + 'FormTitle'}>
                                <h1>Pano Adı</h1>
                                <input maxLength='17' ref={inputRef} required type="text" name="title" id="addTitle" placeholder='Örnek: Market Planı' />
                            </div>
                            <div className="newBoardButton">
                                {/* <button className='addButton hover' type="submit">+Add New Column</button> */}
                                <button className='submit' type="submit">Yeni Pano Oluştur</button>
                            </div>
                        </form>
                    </dialog>
            </div>
        </>
    )
}

export default Board