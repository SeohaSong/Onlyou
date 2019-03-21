import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  status = 'input';

  ngOnInit() {
    window.onload = this.controllDisplay
    window.onresize = this.controllDisplay
  }

  upload() {
    if (this.status == 'input') {
      let uploader = (<HTMLInputElement>document.getElementById('uploader'))
      uploader.onchange = () => this.startProcess(uploader)
      uploader.click()
    } else if (this.status == 'output') {
      document.getElementById('input-box').classList.add('on')
      document.getElementById('output-box').classList.remove('on')
      this.status = 'input'
    }
  }

  download() {
    if (this.status == 'output') {
      console.log(this.status)
    }
  }

  controllDisplay() {
    let box = document.getElementById('main-frame')
    let cutoff = box.clientHeight+100
    console.log(cutoff)
    if (window.innerHeight < cutoff) {
      box.style.width = (window.innerHeight-128)/2+'px'
    } else {
      box.style.width = '100%'
    }
  }

  startProcess(uploader) {
    this.status = 'pending'
    let reader = new FileReader()
    reader.readAsDataURL(uploader.files[0])
    reader.onload = () => {
      uploader.value = '';
      let data = reader.result+''
      document.getElementById('input-img').setAttribute('src', data)
      let input_box = document.getElementById('input-box')
      let output_box = document.getElementById('output-box')
      input_box.classList.remove('on')
      input_box.classList.add('pending')
      output_box.classList.add('pending')
      setTimeout(() => {
        let img = document.getElementById('output-img')
        img.setAttribute('src', 'assets/img/test/output.png')
        let loop_id = setInterval(() => {
          if (img.clientHeight > 0) {
            clearInterval(loop_id)
            if (img.clientHeight > img.clientWidth) {
              img.style.width = 'auto'
              img.style.height = '100%'
            }
            output_box.classList.add('on')
            input_box.classList.remove('pending')
            output_box.classList.remove('pending')
            this.status = 'output'
          }				
        }, 100)
      }, 2000)
    }
  }
}
