import kanban from '../../public/images/kanban.svg'
import hArrow from '../../public/images/underArrow.svg'
import Close from '../../public/images/delete.svg'
import board from '../../public/images/board.svg'
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useContext, useRef } from 'react';
import { GlobalContext } from './GlobalContext';

import dark from '../../public/images/nightmode.svg'
import light from '../../public/images/lightmode.svg'
import threedot from '../../public/images/threedot.svg'

function Header(){

  const { theme , setTheme , data , setCurrentBoard , currentBoard , todos , setTodos , content } = useContext(GlobalContext);

  const Navigate = useNavigate();

  const inputRef = useRef(null);
  const inputBoardRef = useRef(null);
  const editInputBoardRef = useRef(null);

  const openBoardRef = useRef(null);
  const editOrDeleteRef = useRef(null);
  const editBoardRef = useRef(null);
  const deleteBoardRef = useRef(null);
  const newBoardRef = useRef(null);
  const addTaskRef = useRef(null);

  const indexBoard = todos[0].panolar.findIndex((data) => data.isim === currentBoard.replace('-', ' '));

    function openModal(ev){
      openBoardRef.current.showModal();
    }
    function openAddTask(evAdd){
      addTaskRef.current.showModal();
    }
    function openColumnModal(ev){
      openBoardRef.current.close();
      newBoardRef.current.showModal();
    }
    function openEditOrDeleteBoard(){
      editOrDeleteRef.current.classList.toggle('display-hidden');
      editOrDeleteRef.current.classList.toggle('display-block');
    }
    function openEditModal(){
      editOrDeleteRef.current.classList.toggle('display-hidden');
      editOrDeleteRef.current.classList.toggle('display-block');
      editBoardRef.current.showModal();
      editInputBoardRef.current.title.value = currentBoard;
    }
    function openDeleteModal(){
      editOrDeleteRef.current.classList.toggle('display-hidden');
      editOrDeleteRef.current.classList.toggle('display-block');
      deleteBoardRef.current.showModal();
    }
    function closeModal(ev){
      openBoardRef.current.close();
    }
    function closeAddTask(evAdd){
      inputRef.current.title.value = '';
      inputRef.current.description.value = '';
      addTaskRef.current.close();
    }
    function closeColumnModal(ev){
      inputBoardRef.current.title.value = '';
      newBoardRef.current.close();
    }
    function closeEditModal(){
      editBoardRef.current.close();
      editInputBoardRef.current.title.value = currentBoard;
    }
    function closeDeleteModal(){
      deleteBoardRef.current.close();
    }
    function handleTheme(){
      if(theme === 'dark'){
        setTheme('light');
      }else{
        setTheme('dark');
      }
      document.documentElement.classList.toggle('dark');
      // document.documentElement.children[1].children[0].children[1].children[1].children[0].children[1].classList.toggle('light');
    }

    function newTask(e){
      e.preventDefault();
      const taskData = Object.fromEntries(new FormData(e.target));
      console.log(taskData);
      let statusNumber;
      if(taskData){
        if(taskData.status === 'Yapılacak'){
        statusNumber = 0;
        }else if(taskData.status === 'Yapılıyor'){
          statusNumber = 1;
        }else if(taskData.status === 'Bitti'){
          statusNumber = 2;
        }
      }

      taskData.title = taskData.title.replace(/\b\w/g, match => match.toUpperCase());

      const newTask = {
        baslik: taskData.title,
        aciklama: taskData.description,
        durum: taskData.status,
        statusID: statusNumber,
      }
      
      setTodos((prevDodos) => {
        const newDodos = [...prevDodos];
        newDodos[0].panolar[indexBoard].sutunlar[statusNumber].gorevler.push(newTask);
        localStorage.setItem('dodos' , JSON.stringify(newDodos));
        return newDodos;
      });
      closeAddTask();
    };

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
        localStorage.setItem('dodos',JSON.stringify(newDodos));
        console.log(newDodos);
        return newDodos;
      });
      // boardData.title = '';
      inputRef.current.value = '';
      Navigate('/' + boardData.title);
      closeColumnModal();
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

    function deleteBoard(){
      setTodos((prevDodos) => {
        const newDodos = [...prevDodos];
        newDodos[0].panolar.splice(indexBoard , 1);
        localStorage.setItem('dodos', JSON.stringify(newDodos));
        return newDodos;
      })
      deleteBoardRef.current.close();
      if(indexBoard === 0){
        if(todos[0].panolar.length > 0){
          Navigate('/' + todos[0].panolar[0].isim.replace(' ', '-'));
        }else{
          Navigate('/');
        }
      }
      else{
        Navigate('/' + todos[0]?.panolar[0]?.isim.replace(' ', '-'));
      }
    }
    function editBoard(e){
      e.preventDefault();
      const editData = Object.fromEntries(new FormData(e.target));

      editData.title = editData.title.replace(/[ışçöğü]/g, function(match) {
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
      
      editData.title = editData.title.replace(/\b\w/g, match => match.toUpperCase());
      
      // editData.title = editData.title.replace('ı','i')
      // .replace('ş','s')
      // .replace('ç','c')
      // .replace('ö','o')
      // .replace('ğ','g')
      // .replace('ü','u');

      setTodos((prevDodos) => {
        const newDodos = [...prevDodos];
        newDodos[0].panolar[indexBoard].isim = editData.title;
        localStorage.setItem('dodos' , JSON.stringify(newDodos));
        return newDodos;
      })
      closeEditModal();
    }
  return(
    <>
      <header>
          <div className={theme + "Header"} id={theme + 'Header'}>
            <div className="headerLeft">
              <img className='logo' src={kanban} alt="" />
              <div onClick={(ev) => openModal(ev)} className={theme + "Category cursor"} id={theme + 'Category'}>
                <h1>{content? currentBoard : 'DodoList'}</h1>
                <img src={hArrow} alt="" />
              </div>
              <div className={theme + "MobilCategory"} id={theme + 'MobilCategory'}>
                <h1>{content? currentBoard : 'DodoList'}</h1>
              </div>
            </div>
            <div className="taskAndEdit">
                <a onClick={(evAdd) => openAddTask(evAdd)} className={content? 'link newTask cursor-cell' : 'hiddenTouch newTask'}>+Yeni Görev Ekle</a>
                <a onClick={(evAdd) => openAddTask(evAdd)} className={content? 'link mobilNewTask cursor' : 'hiddenTouch mobilNewTask'}>+</a>
                <img onClick={() => openEditOrDeleteBoard()} className={content? 'cursor threedot' : 'hiddenTouch'} src={threedot} alt="" />
            </div>
                {content? <div ref={editOrDeleteRef} className={theme + 'EditAndDeleteModal display-hidden'} id={theme + 'EditAndDeleteModal'}>
                  <div className="editButtonBox">
                    <button onClick={() => openEditModal()} className='edit'>Düzenle</button>
                    <button onClick={() => openDeleteModal()} className='delete'>Sil</button>
                  </div>
                </div>: ''}
                <dialog ref={editBoardRef} className={theme + 'AddTaskDialog'} id={theme + 'AddTaskDialog'}>
                    <form onSubmit={(e) => editBoard(e)} ref={editInputBoardRef} className='addNewTaskModal' autoComplete='off'>
                        <div className="modalHead">
                            <h1>Panoyu Düzenle</h1>
                            <img src={Close} className='closeModal cursor' onClick={(ev) => closeEditModal(ev)} />
                        </div>
                        <div className={theme + "FormTitle"} id={theme + 'FormTitle'}>
                            <h1> Yeni Pano Adı</h1>
                            <input maxLength='17' type="text" name="title" id="addTitle" placeholder='Örnek: Market Planı' />
                        </div>
                        {/* <div className={theme + "FormTitle"} id={theme + 'FormTitle'}>
                            <h1>Pano Sütunları</h1>
                            <div className={theme + "BoardColumns"} id={theme + 'BoardColumns'}>
                                <input type="text" name="title" id="addTitle" placeholder="örnek: Todo , Doing , Done" />
                                <img src={Close} className='closeModal cursor' onClick={(evAdd) => closeAddTask(evAdd)} />
                            </div>
                            <div className={theme + "BoardColumns"} id={theme + 'BoardColumns'}>
                                <input type="text" name="title" id="addTitle" placeholder="örnek: Todo , Doing , Done" />
                                <img src={Close} className='closeModal cursor' onClick={(evAdd) => closeAddTask(evAdd)} />
                            </div>
                        </div> */}
                        <div className="newBoardButton">
                            {/* <button className='addButton hover' type="submit">+Add New Column</button> */}
                            <button className='submit' type="submit">Kaydet</button>
                        </div>
                    </form>
                </dialog>
                <dialog className={theme + "DeleteModal"} id={theme + 'DeleteModal'} ref={deleteBoardRef}>
                  <div className={theme + "DeleteModal"} id={theme + 'DeleteModal'}>
                    <h1 className='color-red'>Bu Panoyu Sil?</h1>
                    <p className='color-red'>{currentBoard}</p>
                    <p> panosunu silmek istediğinizden emin misiniz? Bu işlem tüm sütunları ve görevleri kaldıracaktır ve geri alınamaz.</p>
                    <div className="deleteButtonBox">
                      <button onClick={() => deleteBoard()} className='delete'>Sil</button>
                      <button onClick={() => closeDeleteModal()} className='cancel'>Vazgeç</button>
                    </div>
                  </div>
                </dialog>
                <dialog ref={addTaskRef} className={theme + 'AddTaskDialog'} id={theme + 'AddTaskDialog'}>
                  <form ref={inputRef} onSubmit={(e) => newTask(e)} className='addNewTaskModal' autoComplete='off'>
                    <div className="modalHead">
                      <h1>Yeni Görev Ekle</h1>
                      <img src={Close} className='closeModal cursor' onClick={(evAdd) => closeAddTask(evAdd)} />
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
                    <button className='submit' type="submit">Ekle</button>
                  </form>
                </dialog>
            <dialog ref={openBoardRef} className={theme + 'CategoryDialog'} id={theme + 'CategoryDialog'}>
              <div className={theme + "CategoryModal"} id={theme + 'CategoryModal'}>
                <div className="boardCounter">
                  <h1>TÜM SÜTUNLAR</h1>
                  <img src={Close} className='closeModal cursor' onClick={(ev) => closeModal(ev)} />
                </div>
                <div className="boardList">
                  <BoardList />
                  <div onClick={(ev) => openColumnModal(ev)} className="newCategory cursor hover">
                    <img src={board} alt="" />
                    <h1>+ Yeni Pano Oluştur</h1>
                  </div>
                  
                  <div className={theme + "MobilThemeToggle"} id={theme + 'MobilThemeToggle'}>
                    <img src={light} alt="" />
                    <label className="toggle-switch">
                        <input type="checkbox"/>
                            <div onClick={handleTheme} className="toggle-switch-background">
                            <div className="toggle-switch-handle"></div>
                        </div>
                    </label>
                    <img src={dark} alt="" />
                  </div>
                </div>
              </div>
            </dialog>
            <dialog ref={newBoardRef} className={theme + 'AddTaskDialog'} id={theme + 'AddTaskDialog'}>
                <form onSubmit={(e) => newBoard(e)} ref={inputBoardRef} className='addNewTaskModal' autoComplete='off'>
                    <div className="modalHead">
                        <h1>Yeni Pano Oluştur</h1>
                        <img src={Close} className='closeModal cursor' onClick={(ev) => closeColumnModal(ev)} />
                    </div>
                    <div className={theme + "FormTitle"} id={theme + 'FormTitle'}>
                        <h1>Pano Adı</h1>
                        <input maxLength='17' type="text" name="title" id="addTitle" placeholder='Örnek: Market Planı' />
                    </div>
                    {/* <div className={theme + "FormTitle"} id={theme + 'FormTitle'}>
                        <h1>Pano Sütunları</h1>
                        <div className={theme + "BoardColumns"} id={theme + 'BoardColumns'}>
                            <input type="text" name="title" id="addTitle" placeholder="örnek: Todo , Doing , Done" />
                            <img src={Close} className='closeModal cursor' onClick={(evAdd) => closeAddTask(evAdd)} />
                        </div>
                        <div className={theme + "BoardColumns"} id={theme + 'BoardColumns'}>
                            <input type="text" name="title" id="addTitle" placeholder="örnek: Todo , Doing , Done" />
                            <img src={Close} className='closeModal cursor' onClick={(evAdd) => closeAddTask(evAdd)} />
                        </div>
                    </div> */}
                    <div className="newBoardButton">
                        {/* <button className='addButton hover' type="submit">+Add New Column</button> */}
                        <button className='submit' type="submit">Yeni Pano Oluştur</button>
                    </div>
                </form>
            </dialog>
          </div>
      </header>
    </>
  )
}

export default Header