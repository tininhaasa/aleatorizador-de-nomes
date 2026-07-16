// ============================================================
// 📚 Página de uma turma específica ('/turma/:id')
//
// CONCEITO IMPORTANTE: quando você navega de /turma/3 para /turma/7,
// o Angular costuma REAPROVEITAR a mesma instância deste componente
// (já que o componente da rota não mudou, só o parâmetro). Isso
// significa que ngOnInit() NÃO roda de novo automaticamente!
//
// Por isso, em vez de ler o parâmetro uma única vez, assinamos
// route.paramMap (um Observable) e recarregamos os dados sempre
// que o :id mudar — mesmo sem destruir/recriar o componente.
// ============================================================

import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TurmaService } from '../../services/turma.service';
import { AlunoService } from '../../services/aluno.service';
import { SorteioService } from '../../services/sorteio.service';
import { Turma } from '../../models/turma';
import { Aluno } from '../../models/aluno';
import { StatusSorteio, ItemHistorico } from '../../models/sorteio';

type Aba = 'sortear' | 'alunos' | 'historico';

type SubAbaSortear = 'sorteio' | 'controle';
@Component({
  selector: 'app-turma-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './turma-dashboard.html',
  styleUrl: './turma-dashboard.css'
})
export class TurmaDashboard implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private turmaService = inject(TurmaService);
  private alunoService = inject(AlunoService);
  private sorteioService = inject(SorteioService);

  turmaId = signal<number>(0);
  turma = signal<Turma | null>(null);
  abaAtiva = signal<Aba>('sortear');
// No topo do arquivo, junto com o type Aba:

// Junto com os outros signals:
subAbaSortear = signal<SubAbaSortear>('sorteio');
  // ── Alunos ──────────────────────────────────────────────
  alunos = signal<Aluno[]>([]);
  novoNomeAluno = signal('');

  // ── Sorteio ─────────────────────────────────────────────
  ausentesSelecionados = signal<Set<number>>(new Set());
  resultadoSorteio = signal<{ sorteados: string[]; ciclo: number; reiniciado: boolean } | null>(null);
  statusFila = signal<StatusSorteio | null>(null);
  contagemRegressiva = signal<number | null>(null);
  private intervalContagem?: ReturnType<typeof setInterval>;

  // ── Histórico ───────────────────────────────────────────
  historico = signal<ItemHistorico[]>([]);

  erro = signal('');

  private paramSub?: Subscription;

  ngOnInit(): void {
    this.paramSub = this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      this.turmaId.set(id);
      this.resultadoSorteio.set(null);
      this.ausentesSelecionados.set(new Set());
      this.abaAtiva.set('sortear');
      this.subAbaSortear.set('sorteio');
      this.carregarTudo();
    });
  }

  ngOnDestroy(): void {
    this.paramSub?.unsubscribe();
    if (this.intervalContagem) clearInterval(this.intervalContagem);
  }

  mudarAba(aba: Aba): void {
    this.abaAtiva.set(aba);
  }

  carregarTudo(): void {
    this.carregarTurma();
    this.carregarAlunos();
    this.carregarStatus();
    this.carregarHistorico();
  }

  carregarTurma(): void {
    this.turmaService.buscarPorId(this.turmaId()).subscribe({
      next: (dados) => this.turma.set(dados),
      error: () => this.erro.set('Erro ao carregar a turma.'),
    });
  }

  // ════════════════════ ALUNOS ════════════════════
  carregarAlunos(): void {
    this.alunoService.listarPorTurma(this.turmaId()).subscribe({
      next: (dados) => this.alunos.set(dados),
      error: () => this.erro.set('Erro ao carregar alunos.'),
    });
  }

  adicionarAluno(): void {
    const entrada = this.novoNomeAluno().trim();
    if (!entrada) return;

    const nomes = entrada.split(',').map(n => n.trim()).filter(n => n.length > 0);
    if (nomes.length === 0) return;

    let adicionados = 0;
    nomes.forEach(nome => {
      this.alunoService.criar(nome, this.turmaId()).subscribe({
        next: () => {
          adicionados++;
          if (adicionados === nomes.length) {
            this.novoNomeAluno.set('');
            this.carregarAlunos();
            this.carregarStatus();
          }
        },
        error: () => this.erro.set('Erro ao adicionar aluno.'),
      });
    });
  }

  removerAluno(id: number): void {
    this.alunoService.remover(id).subscribe({
      next: () => {
        this.carregarAlunos();
        this.carregarStatus();
      },
      error: () => this.erro.set('Erro ao remover aluno.'),
    });
  }

  // ════════════════════ SORTEIO ════════════════════
  alternarAusente(id: number): void {
    const atual = new Set(this.ausentesSelecionados());
    if (atual.has(id)) {
      atual.delete(id);
    } else {
      atual.add(id);
    }
    this.ausentesSelecionados.set(atual);
  }

  estaAusente(id: number): boolean {
    return this.ausentesSelecionados().has(id);
  }

  iniciarSorteio(): void {
    this.erro.set('');
    this.resultadoSorteio.set(null);
    this.contagemRegressiva.set(5);

    this.intervalContagem = setInterval(() => {
      const atual = this.contagemRegressiva();
      if (atual === null || atual <= 1) {
        clearInterval(this.intervalContagem);
        this.contagemRegressiva.set(null);
        this.realizarSorteio();
        return;
      }
      this.contagemRegressiva.set(atual - 1);
    }, 1000);
  }

  private realizarSorteio(): void {
    this.erro.set('');
    this.resultadoSorteio.set(null);
    const ausentes = Array.from(this.ausentesSelecionados());

    this.sorteioService.sortear(this.turmaId(), ausentes).subscribe({
      next: (resposta) => {
        this.resultadoSorteio.set({
          sorteados: resposta.sorteados.map(a => a.nome),
          ciclo: resposta.ciclo,
          reiniciado: resposta.ciclo_reiniciado,
        });
        this.carregarStatus();
        this.carregarHistorico();
        this.ausentesSelecionados.set(new Set());
      },
      error: (err) => {
        this.erro.set(err?.error?.erro || 'Erro ao sortear.');
      },
    });
  }

  // ════════════════════ STATUS DA FILA ════════════════════
  carregarStatus(): void {
    this.sorteioService.status(this.turmaId()).subscribe({
      next: (dados) => this.statusFila.set(dados),
      error: () => {},
    });
  }

  // ════════════════════ HISTÓRICO ════════════════════
  carregarHistorico(): void {
    this.sorteioService.historico(this.turmaId()).subscribe({
      next: (dados) => this.historico.set(dados),
      error: () => {},
    });
  }

  formatarData(dataIso: string): string {
    return new Date(dataIso).toLocaleString('pt-BR');
  }
}
