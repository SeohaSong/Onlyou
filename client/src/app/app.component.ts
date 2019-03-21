import { Component } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  status = 'input'
  input_img: any
  output_img: any
  input_box: any
  output_box: any
  output_url: string

  ngOnInit() {
    window.addEventListener('load', () => {
      this.controllDisplay()
      this.input_img = document.getElementById('input-img')
      this.output_img = document.getElementById('output-img')
      this.input_box = document.getElementById('input-box')
      this.output_box = document.getElementById('output-box')
    })
    window.onresize = this.controllDisplay
  }

  controllDisplay() {
    let box = document.getElementById('main-frame')
    box.classList.add('loading')
    if (window.innerHeight < window.innerWidth) box.classList.add('widescreen')
    else box.classList.remove('widescreen')
    setTimeout(() => {
      if (window.innerHeight < box.clientHeight+128) {
        if (box.classList.contains('widescreen')) {
          box.style.width = (window.innerHeight-32)*2+'px'
        } else box.style.width = (window.innerHeight-64)/2+'px'
      } else box.style.width = '100%'
      box.classList.remove('loading')
    }, 1000)
  }

  upload() {
    let uploader = (<HTMLInputElement>document.getElementById('uploader'))
    if (this.status == 'input') {
      uploader.onchange = () => this.startProcess(uploader)
      uploader.click()
    } else if (this.status == 'output') {
      document.getElementById('input-box').classList.add('on')
      document.getElementById('output-box').classList.remove('on')
      document.getElementById('input-img').setAttribute('src', '')
      document.getElementById('output-img').setAttribute('src', '')
      uploader.value = ''
      this.status = 'input'
    }
  }

  download() {
    if (this.status == 'output') {
      var link = document.createElement("a");
      link.download = 'output';
      link.href = this.output_url;
      link.click();
    }
  }

  beautifyImage(img) {
    if (img.clientHeight > img.clientWidth) {
      img.style.width = 'auto'
      img.style.height = '100%'
    } else {
      img.style.width = '100%'
      img.style.height = 'auto'
    }
  }

  startProcess(uploader) {
    this.status = 'pending'
    let reader = new FileReader()
    reader.readAsDataURL(uploader.files[0])
    reader.onload = () => {
      this.input_img.setAttribute('src', reader.result+'')
      let loop_id = setInterval(() => {
        if (this.input_img.clientHeight > 0) {
          clearInterval(loop_id)
          this.beautifyImage(this.input_img)
          this.input_box.classList.remove('on')
          this.input_box.classList.add('pending')
          this.output_box.classList.add('pending')
          setTimeout(() => {
            this.output_url = 'assets/img/test/output.png'
            this.output_img.setAttribute('src', this.output_url)
            let loop_id = setInterval(() => {
              if (this.output_img.clientHeight > 0) {
                clearInterval(loop_id)
                this.beautifyImage(this.output_img)
                this.output_box.classList.add('on')
                this.input_box.classList.remove('pending')
                this.output_box.classList.remove('pending')
                this.status = 'output'
              }				
            }, 100)
          }, 2000)
        }
      }, 100)
    }
  }
}
