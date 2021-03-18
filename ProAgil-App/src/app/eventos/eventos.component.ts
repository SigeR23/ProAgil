import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Evento } from '../_models/Evento';
import { EventoService } from '../_services/evento.service';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';

defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  titulo = 'Eventos'

  eventosFiltrados!: Evento[];
  eventos!: Evento[];
  evento!: Evento;
  imagemLargura = 50;
  imagemMargem = 2;
  mostrarImagem = false;
  registerform!: FormGroup;
  modoSalvar = 'post'
  bodyDeletarEvento = '';
  dataEvento!: string;

  _filtroLista!: string;

  get filtroLista(): string {
    return this._filtroLista;
  }
  set filtroLista(value: string) {
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }

  constructor(
    private eventoService: EventoService
    , private modalService: BsModalService
    , private fb: FormBuilder
    , private localeService: BsLocaleService
    , private toastr: ToastrService) 
  { 
    this.localeService.use('pt-br');
  }

  ngOnInit() {
    this.validation();
    this.getEventos();
  }

  filtrarEventos(filtrarPor: string) : Evento[] {
    filtrarPor = filtrarPor.toLowerCase();
    return this.eventos.filter(
      evento => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  validation() {
    this.registerform = this.fb.group({
      tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      imagemURL: ['', Validators.required],
      qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get f(){
    return this.registerform.controls;
  }

  salvarAlteracao(template: any) {
    if(this.registerform.valid) {
      if(this.modoSalvar === 'put') {
        this.evento = Object.assign({id: this.evento.id}, this.registerform.value);
        this.eventoService.putEvento(this.evento).subscribe(
          (novoEvento: Evento) => {
            console.log(novoEvento);
            template.hide();
            this.getEventos();
            this.toastr.success('Registro alterado com sucesso!', 'Salvando');

          }, error => {
            console.log(error);
            this.toastr.error(`Erro ao salvar registro: ${error}`, 'Salvando');
            
          }
        );
      }

      else {
        this.evento = Object.assign({}, this.registerform.value);
        this.eventoService.postEvento(this.evento).subscribe(
          (novoEvento: Evento) => {
            console.log(novoEvento);
            template.hide();
            this.getEventos();
            this.toastr.success('Registro inserido com sucesso!', 'Salvando');
          }, error => {
            console.log(error);
            this.toastr.error(`Erro ao salvar registro: ${error}`, 'Salvando');
          }
        );
      }
    }
  }

  editarEvento(evento: Evento, template: any) {
      this.modoSalvar = 'put';
      var x = atob(this.modoSalvar)
      this.evento = evento;
      this.openModal(template);
      this.registerform.patchValue(evento);
  }

  novoEvento(template: any) {
    this.modoSalvar = 'post';
    this.openModal(template);
  }

  excluirEvento(evento: Evento, template: any) {
    this.openModal(template);
    this.evento = evento;
    this.bodyDeletarEvento = `Tem certeza que deseja excluir o Evento: ${evento.tema}, Código: ${evento.id}`;
  }

  confirmeDelete(template: any) {
    this.eventoService.deleteEvento(this.evento.id).subscribe(
      () => {
          template.hide();
          this.getEventos();
          this.toastr.success('Registro deletado com sucesso', 'Removendo');

        }, error => {
          this.toastr.error('Erro ao tentar deletar o registro', 'Removendo');
          console.log(error);
        }
    );
  }

  openModal(template: any)
  {
    this.registerform.reset();
    template.show();

  }      
  getEventos() {
    this.eventoService.getAllEvento().subscribe((_eventos: Evento[]) => 
    { 
      this.eventos = _eventos;
      this.eventosFiltrados = this.eventos;
    }, error => {
      this.toastr.error(`Erro ao tentar carregar eventos: ${error}`, 'Carregando');
    }
    ); 
  }

  alterarImagem() {
    this.mostrarImagem = !this.mostrarImagem;
  }

}
