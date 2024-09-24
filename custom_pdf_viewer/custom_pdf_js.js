//----------------- Class Defination End -----------------//
class PDFViewer {
    constructor(option) {
        this.pdfUrl = option.pdfUrl;
        //FIRSTY WRITE HTML IN MAIN CONTAINER
        this.main_container = document.getElementById(option.containerId);
        this.main_container.innerHTML = `<div class="row border border-primary" id="pdfControllBar">
            <div class="col-auto" id="pdfNameSection">
                <h5 class="text-primary" id="pdfName">PDF NAME</h5>
            </div>
            <div class="col d-flex justify-content-end m-0 p-0">
                <div id="selectionToolbar">
                    <input type="text"  id="selectionNote" title="Write note for selected area. Press 'Enter' to bookmark">
                    <input type="color"  id="selectionBackground" title="Select Color">
                </div>
                <div class="btn-group" role="group" aria-label="Basic example">
                    <span class="btn text-bold">
                        <strong>Page: <span id="cp_page_num"></span> / <span id="cp_page_count"></span></strong>
                    </span>
                    <input type="text"  id="go_to_page_no" title="Enter page number and press Enter key.">
                    <button type="button" id="cp_prev-page" class="btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
                        </svg>
                    </button>
                    <button type="button" id="cp_next-page" class="btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
                        </svg>
                    </button>
                    <button type="button" id="book_mark_btn" class="btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bookmark" viewBox="0 0 16 16">
                        <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z"/>
                        </svg>
                    </button>
                    <button type="button" id="book_mark_list_btn" class="btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list-task" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M2 2.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5zM3 3H2v1h1z"/>
                        <path d="M5 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M5.5 7a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1zm0 4a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1z"/>
                        <path fill-rule="evenodd" d="M1.5 7a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H2a.5.5 0 0 1-.5-.5zM2 7h1v1H2zm0 3.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm1 .5H2v1h1z"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
        <div class="row" id="pdfOutercontainer">
            <!-- Content goes here -->
            <div id="pdf-container">
                <!-- Content goes here -->
            </div>
            <div id="selectionContainer">
                <div id="selection" style="background-color:rgba(0, 0, 255, 0.1)">
                    <span id="selectionNoteText" style="display: none;"></span>
                </div>

                <div id="bookMarkArea" style="width:100%; height:100%;">
                </div>
            </div>
            <div id="bookMarkListSection" style="display:none;" class="p-2">
                
            </div>
        </div>`;
        //FETCH ELEMENTS OF MAIN CONTAINER
        this.container = document.getElementById('pdf-container');
        this.pdfOutercontainer = document.getElementById('pdfOutercontainer');
        this.prevPageButton = document.getElementById("cp_prev-page");
        this.nextPageButton = document.getElementById("cp_next-page");
        this.bookMarkButton = document.getElementById("book_mark_btn");
        this.bookMarkListSection = document.getElementById("bookMarkListSection");
        this.bookMarkListButton = document.getElementById("book_mark_list_btn");
        this.pageCounter = document.getElementById("cp_page_num");
        this.totalPageCounter = document.getElementById("cp_page_count");
        this.go_to_pageInput = document.getElementById("go_to_page_no");
        this.currentPage = 1;
        this.bookMarkFun = option.bookMarkCallback;
        this.bookmarks = option.bookmarks || null;
        this.bookMarkArea = document.getElementById('bookMarkArea');
        this.pdfDoc = '';
        this.init();

    }
    currentFormatedDate = () => {
        //RETURN THE DATE IN THIS FORMATED -  19 JUNE 2024 10:10 AM

        const now = new Date();
        // Extract the components
        const day = now.getDate();
        const month = now.getMonth(); // Months are zero-indexed
        const year = now.getFullYear();
        var hours = now.getHours();
        var minutes = now.getMinutes();
        const period = hours >= 12 ? 'PM' : 'AM';
        
        // Convert 24-hour time to 12-hour time
        hours = hours % 12 || 12; // Convert hour '0' to '12'

        // Format minutes to be two digits
        const formattedMinutes = minutes.toString().padStart(2, '0');
      
        // Month names array
        const monthNames = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        // Get the month name
        const monthName = monthNames[month];
      
        // Construct the formatted date and time string
        const formattedDate = `${day} ${monthName} ${year} ${hours}:${formattedMinutes} ${period}`;
      
        return formattedDate;
    }
      
    
      

    init() {
        

        pdfjsLib.getDocument(this.pdfUrl).promise.then(pdfDoc => {
            this.pdfDoc = pdfDoc;

            //EXTRACT FILE NAEM
            const path = this.pdfUrl;
            const filename = path.substring(path.lastIndexOf('/') + 1);
            document.getElementById('pdfName').innerText = filename
            this.renderPage(pdfDoc, this.currentPage);
            this.totalPageCounter.textContent = pdfDoc.numPages;
            
           

            this.prevPageButton.addEventListener('click', () => {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.renderPage(pdfDoc, this.currentPage);
                }
            });

            this.nextPageButton.addEventListener('click', () => {
                if (this.currentPage < pdfDoc.numPages) {
                    this.currentPage++;
                    this.renderPage(pdfDoc, this.currentPage);
                }
            });
            this.bookMarkButton.addEventListener('click', () => {
                //if bookmarkd function exists in option
                const selection = document.querySelector('#selectionContainer #selection');
                const selection_left = selection.style.left;
                const selection_top = selection.style.top;
                const selection_width = selection.style.width;
                const selection_height = selection.style.height;
                const selection_background = selection.style.background;
                const selection_notes = document.querySelector('#selectionContainer #selection').innerText;

                if(selection_notes == ''){
                    //empty selection notes
                    alert('Bookmark Title Required');
                    return;
                }

                const currentTime = new Date()
                
                var selectionDetails = {
                    'left' : selection_left,
                    'top' : selection_top,
                    'width': selection_width,
                    'height': selection_height,
                    'backgroundColor': selection_background,
                    'notes': selection_notes,
                    'deleteAccess': 1,//BY DEFAULT
                    'bookmark_at': {
                        'date_time' : this.currentFormatedDate(),
                        'time' : currentTime.toLocaleTimeString(),
                        'date' : currentTime.toLocaleDateString(),
                    }
                    
                };
                
                //push bookmarkk
                if(this.bookmarks){
                    if(this.bookmarks[this.currentPage]){
                        this.bookmarks[this.currentPage].push(selectionDetails);
                    }else{
                        this.bookmarks[this.currentPage] = [selectionDetails];
                    }
                }
                this.showBookmark();
                //clear notest area
                let selectionNoteText = document.querySelector('#selection #selectionNoteText');
                selectionNoteText.innerText = '';
                selectionNote.value = '';
                selection.style.width=0;
                selection.style.height=0;

                if(this.bookMarkFun){
                    this.bookMarkFun({
                        'currentPage' : this.currentPage,
                        'selectionArea' : selectionDetails,
                        'bookmarks' : this.bookmarks
                    });
                }
            });
            this.go_to_pageInput.addEventListener('keydown', (e) => {
                if(e.key=='Enter'){
                    this.goToPage(e.target.value);
                }
            });

            this.bookMarkListButton.addEventListener('click', (e) => {
                this.bookMarkListSection.style.display = this.bookMarkListSection.style.display == 'none' ? 'block' : 'none';
                this.renderBookMarkList();
            });

            //------------- SCROLL TO NEXT PREVIOUS Code START ----------------//
            this.pdfOutercontainer.addEventListener('wheel', function(event) {
                const container = this;
                const scrollTop = container.scrollTop;
                const scrollHeight = container.scrollHeight;
                const offsetHeight = container.offsetHeight;
                const scrollDirection = (event.deltaY > 0) ? 'down' : 'up';
                console.log(scrollTop)
                if (scrollTop + offsetHeight >= scrollHeight && scrollDirection === 'down') {
                    // Next page
                    document.getElementById('cp_next-page').click();
                }else if (scrollTop == 0 && scrollDirection == 'up') {
                    // Previous page
                    document.getElementById('cp_prev-page').click();
                }
            });
            
            //------------- SCROLL TO NEXT PREVIOUS Code End ----------------//
            
        });


        //------------- Selection Code Start ----------------//
        const selectionContainer = document.getElementById('selectionContainer');
        const selection = document.querySelector('#selectionContainer #selection');
        const selectionBackground = document.querySelector('#selectionToolbar #selectionBackground');
        const selectionNote = document.querySelector('#selectionToolbar #selectionNote');
        // const selection = document.createElement('div');
        // selection.id = 'selection';
        // this.container.appendChild(selection);

        let startX, startY;

        selectionContainer.addEventListener('mousedown', (e) => {
            startX = e.clientX - selectionContainer.getBoundingClientRect().left;
            startY = e.clientY - selectionContainer.getBoundingClientRect().top;
            updateSelection(startX, startY, 0, 0); // Start with a zero-size selection
            selectionContainer.addEventListener('mousemove', onMouseMove);
            selectionContainer.addEventListener('mouseup', onMouseUp);
        });
        selectionBackground.addEventListener('change', (e) => {
            e.preventDefault();
            selection.style.background = e.currentTarget.value;
            selection.style.opacity = 0.5;
        });
        selectionNote.addEventListener('keyup', (e) => {
            let notes = e.currentTarget.value
            let selectionNoteText = document.querySelector('#selection #selectionNoteText');
            if(notes.length){
                selectionNoteText.style.display = 'inline';
                selectionNoteText.innerText = notes;
            }else{
                selectionNoteText.style.display = 'none';
            }
            //IF ENTER PRESS THEN SAVE NOTES
            if(e.key == 'Enter' || e.key == 13){
                this.bookMarkButton.click();//trigger bookmark click event
            }
        });

        function onMouseMove(e) {
            const endX = e.clientX - selectionContainer.getBoundingClientRect().left;
            const endY = e.clientY - selectionContainer.getBoundingClientRect().top;
            const width = Math.abs(endX - startX);
            const height = Math.abs(endY - startY);
            const left = Math.min(startX, endX);
            const top = Math.min(startY, endY);
            updateSelection(left, top, width, height);
        }

        function onMouseUp() {
            selectionContainer.removeEventListener('mousemove', onMouseMove);
            selectionContainer.removeEventListener('mouseup', onMouseUp);
        }

        function updateSelection(left, top, width, height) {
            selection.style.left = left + 'px';
            selection.style.top = top + 'px';
            selection.style.width = width + 'px';
            selection.style.height = height + 'px';
        }
        //DELETE BOOKMARK EVENT
       
        //------------- Selection Code End ----------------//

        
    }

    renderPage(pdfDoc, pageNum) {
        this.container.innerHTML = '';
        pdfDoc.getPage(pageNum).then(page => {
            const viewport = page.getViewport({ scale: 1.5 });
            this.container.style.width = viewport.width + 'px';
            this.container.style.height = viewport.height + 'px';
            //SET WIDTH OF SELECTION CONTAINER EQUAL TO PDF CONTIAINER
            document.getElementById('selectionContainer').style.height = viewport.height + 'px';
            //outer container
            this.pdfOutercontainer.style.width = viewport.width + 'px';
            // this.pdfOutercontainer.style.height = viewport.height + 'px';
            //Override pdfControllBar width with pdfcontianr width
            document.getElementById("pdfControllBar").style.width = viewport.width + 'px';

            const canvas = document.createElement('canvas');
            this.container.appendChild(canvas);
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const renderContext = {
                canvasContext: canvas.getContext('2d'),
                viewport: viewport,
            };
            page.render(renderContext);

            this.pageCounter.textContent = pageNum;

            //bookmark
            this.bookMarkArea.innerHTML = '';
            this.showBookmark()
        });
        

    }

    showBookmark(pageNum = this.currentPage){
        if(this.bookmarks && this.bookmarks[pageNum]){
            const bookmarks = this.bookmarks[pageNum];
            // console.log(bookmarks);
            this.bookMarkArea.innerHTML = '';
            if(bookmarks.length > 0){
                bookmarks.forEach((bookmark, index)=>{
                    let deleteBtn = '';
                    if(bookmark.deleteAccess){
                        deleteBtn = `<svg class="deleteBookmarkBtn"  data-index=${index} data-page=${pageNum} style="color:red; font-weight:bold;" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                        </svg>`;
                    }
                    let bookmarkEle = `<div class="bookMarkedArea" style="left: ${bookmark.left || 0}; top: ${bookmark.top || 0}; width: ${bookmark.width || 0}; height: ${bookmark.height || 0}; background-color: ${bookmark.backgroundColor}">
                    <span class="bookMarkedAreaToolbar">
                        <span >
                        ${bookmark.notes || ''}
                        </span>
                        ${deleteBtn}
                    </span>
                    
                    </div>`;
        
                    this.bookMarkArea.innerHTML += bookmarkEle;
                    //ADD DELETE 
                })
    
                // Add event listener to delete bookmark buttons
                const deleteBookmarkBtns = document.querySelectorAll('.deleteBookmarkBtn');
                deleteBookmarkBtns.forEach(btn => {
                    btn.addEventListener('click', (event) => {
                        // event.stopPropagation();
                        const index = event.target.dataset.index;
                        const currentPage = event.target.dataset.page;
                        this.deleteBookMarkFun(index, currentPage);
                    });
                });
            }
            
        }
        
    }
    hideBookmark(pageNum = this.currentPage){
        if(this.bookmarks && this.bookmarks[pageNum]){
            this.bookMarkArea.innerHTML = '';
        }
        
    }

    deleteBookMarkFun(index, currentPage){
        // console.log(index, currentPage, this.bookmarks);
        if(window.confirm("Do you really want to delete this selection?")){
            if(this.bookmarks[currentPage]){
                delete this.bookmarks[currentPage][index]
                this.bookmarks[currentPage].splice(index, 1);//start_index, total_element 
                this.showBookmark();
            }
            // return true;
        }else{
            // return false;
        }
    }

    goToPage(pageNum) {
        let go_to_page_number = parseInt(pageNum);
        if (go_to_page_number > 0 && go_to_page_number <= this.pdfDoc.numPages) {
            this.currentPage = go_to_page_number;//set current page
            this.renderPage(this.pdfDoc, go_to_page_number);
        }else{
            alert(`Invalid Page Number. It should be > 0 or less than ${this.pdfDoc.numPages}`);
            return false;
        }
        return true;
    }

    renderBookMarkList(){
        const bookmarks = this.bookmarks;
        let html = '';
        let dynamic_content = '';
        if (!bookmarks || Object.keys(bookmarks).length === 0) {
            //if no bookmark available 
            dynamic_content = '<tr><th colspan="3">No Bookmark available.</th></tr>';
        }
        Object.entries(bookmarks).forEach(([key, values]) => {
            dynamic_content += `<tr> <th scope="row" colspan="3"> Page - ${key} </th>  </tr>`;
            let row_num = 1;
            values.forEach(value => {
                dynamic_content += `
                    <tr>
                        <th scope="row">${row_num++}</th>
                        <td><a href="#" class="note-title" data-page="${key}"  data-top="${value.top}">${value.notes || ''}</a></td>
                        <td>${value.bookmark_at.date_time || ''}</td>
                    </tr>`;
            });
        });
        html = `<table class="table table-striped text-center">
                <tbody>
                    ${dynamic_content}
                </tbody>
            </table>`;
        this.bookMarkListSection.innerHTML = html;//set content
        // Attach click event listeners to note titles
        document.querySelectorAll('.note-title').forEach(note => {
            note.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent the default anchor behavior
                const pageNum = e.target.getAttribute('data-page');
                var top = e.target.getAttribute('data-top');
                //convert to int by replacing px
                top = top.replace('px', '');
                if(this.goToPage(pageNum)){
                    //automatically scroll to 
                    this.pdfOutercontainer.scrollTop = parseInt(top);
                    
                    //HIDE BOOKMARK LIST SECTION
                    this.bookMarkListSection.style.display == 'none';
                }
            });
        });
    }
}

export default PDFViewer;
//----------------- Class Defination End -----------------//