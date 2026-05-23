import type { Lesson } from '@/types/lesson'

const helloLesson: Lesson = {
  id: 'laravel/fundamentos/hello',
  courseId: 'laravel',
  moduleId: 'fundamentos',
  title: 'Hello, Laravel',
  icon: '🛣️',
  xpReward: 30,
  docUrl: 'https://laravel.com/docs/routing',

  theory: [
    {
      tag: 'laravel-intro',
      title: 'O que é Laravel',
      body: `Laravel é um framework PHP full-stack focado em ergonomia.
Convenções claras (MVC, Eloquent ORM, Blade templates, Artisan CLI).
Roteamento expressivo: a porta de entrada da aplicação são as rotas em routes/web.php.`,
      code: `// routes/web.php
use Illuminate\\Support\\Facades\\Route;

Route::get('/', function () {
    return 'Olá do Laravel!';
});`,
    },
    {
      tag: 'laravel-route-closure',
      title: 'Closure vs Controller',
      body: `Pra rotas simples, uma closure resolve.
Pra lógica de verdade, aponta a rota pra um método de controller.
Controllers ficam em app/Http/Controllers e são gerados com artisan make:controller.`,
      code: `// routes/web.php
use App\\Http\\Controllers\\HomeController;

Route::get('/', [HomeController::class, 'index']);

// app/Http/Controllers/HomeController.php
public function index() {
    return view('home');
}`,
    },
  ],

  flashcards: [
    {
      id: 'laravel/fundamentos/hello/fc-1',
      front: 'Onde vivem as rotas web de uma app Laravel?',
      back: `Em routes/web.php.
Use Route::get/post/put/delete passando URI e handler (closure ou [Controller::class, 'metodo']).`,
      requires: ['laravel-intro'],
    },
    {
      id: 'laravel/fundamentos/hello/fc-2',
      front: 'Quando usar closure vs controller na rota?',
      back: `Closure: protótipo, endpoints triviais, scripts.
Controller: lógica de verdade, reuso, testes — é o padrão em produção.`,
      code: `Route::get('/', [HomeController::class, 'index']);`,
      requires: ['laravel-route-closure'],
    },
  ],

  challenges: [
    {
      id: 'laravel/fundamentos/hello/ch-1',
      type: 'fill-blank',
      title: 'Primeira rota',
      description: 'Registre uma rota GET em "/" que retorna "Olá do Laravel!".',
      xpReward: 20,
      requires: ['laravel-intro'],
      template: `// routes/web.php
use Illuminate\\Support\\Facades\\Route;

Route::___('/', function () {
    return '___';
});`,
      blanks: ['get', 'Olá do Laravel!'],
      solution: `// routes/web.php
use Illuminate\\Support\\Facades\\Route;

Route::get('/', function () {
    return 'Olá do Laravel!';
});`,
      hint: 'O verbo HTTP vira o método estático (get/post/put/delete).',
    },
  ],
}

export default helloLesson
