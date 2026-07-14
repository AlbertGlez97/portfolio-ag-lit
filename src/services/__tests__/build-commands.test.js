import { describe, it, expect } from 'vitest';
import { buildCommands } from '../terminal-commands.js';

const BASE = {
  userInfo: { name: 'Alberto', location: 'CDMX', role: 'Dev', bio_short: 'Full Stack' },
  skills: [{ id: 'js', label: 'JS', level: 7, items: ['React', 'Lit'] }],
  projects: [
    { title: 'Proyecto A', type: 'web', year: 2024 },
    { title: 'Proyecto B', type: 'app', year: 2023 },
    { title: 'Proyecto C', type: 'web', year: 2022 },
    { title: 'Proyecto D', type: 'api', year: 2021 },
    { title: 'Proyecto E', type: 'web', year: 2020 },
    { title: 'Proyecto F', type: 'lib', year: 2019 }, // debe quedar fuera
  ],
  socialLinks: [{ id: 'github', label: 'GitHub', value: 'github.com/ag', url: 'https://github.com/ag' }],
  stackItems: [{ label: 'Vite', value: '5.x' }],
  nowItems: ['Construyendo portafolio', 'Aprendiendo testing'],
  readmeContent: 'Línea 1\nLínea 2',
  neofetchData: { os: 'macOS', shell: 'zsh' },
};

describe('buildCommands — help', () => {
  it('retorna array de lines con los comandos esperados', () => {
    const cmds = buildCommands(BASE);
    const { lines } = cmds.help();
    expect(lines.length).toBeGreaterThan(5);
    const html = lines.map((l) => l.html).join(' ');
    expect(html).toContain('whoami');
    expect(html).toContain('skills');
    expect(html).toContain('clear');
  });
});

describe('buildCommands — whoami', () => {
  it('incluye nombre, location, role y bio con datos completos', () => {
    const { lines } = buildCommands(BASE).whoami();
    const html = lines.map((l) => l.html).join(' ');
    expect(html).toContain('Alberto');
    expect(html).toContain('CDMX');
    expect(html).toContain('Dev');
    expect(html).toContain('Full Stack');
  });

  it('muestra warning con datos vacíos', () => {
    const { lines } = buildCommands({ ...BASE, userInfo: {} }).whoami();
    const html = lines.map((l) => l.html).join(' ');
    expect(html).toContain('sin datos');
  });

  it('muestra solo los campos disponibles con datos parciales', () => {
    const { lines } = buildCommands({ ...BASE, userInfo: { name: 'AG' } }).whoami();
    const html = lines.map((l) => l.html).join(' ');
    expect(html).toContain('AG');
    expect(html).not.toContain('CDMX');
  });

  it('escapa HTML del input del usuario', () => {
    const { lines } = buildCommands({ ...BASE, userInfo: { name: '<b>AG</b>' } }).whoami();
    const html = lines.map((l) => l.html).join(' ');
    expect(html).toContain('&lt;b&gt;');
  });
});

describe('buildCommands — skills', () => {
  it('renderiza barra y los items de cada skill', () => {
    const { lines } = buildCommands(BASE).skills();
    expect(lines).toHaveLength(1);
    expect(lines[0].html).toContain('▓');
    expect(lines[0].html).toContain('React');
    expect(lines[0].html).toContain('Lit');
  });

  it('retorna array vacío si no hay skills', () => {
    const { lines } = buildCommands({ ...BASE, skills: [] }).skills();
    expect(lines).toHaveLength(0);
  });
});

describe('buildCommands — stack', () => {
  it('formatea label → value', () => {
    const { lines } = buildCommands(BASE).stack();
    expect(lines[0].html).toContain('Vite');
    expect(lines[0].html).toContain('5.x');
    expect(lines[0].html).toContain('→');
  });
});

describe('buildCommands — now', () => {
  it('incluye todos los items con bullet y línea de actualización', () => {
    const { lines } = buildCommands(BASE).now();
    const html = lines.map((l) => l.html).filter(Boolean).join(' ');
    expect(html).toContain('• Construyendo portafolio');
    expect(html).toContain('• Aprendiendo testing');
    expect(html).toContain('última actualización');
  });
});

describe('buildCommands — projects', () => {
  it('muestra máximo 5 proyectos', () => {
    const { lines } = buildCommands(BASE).projects();
    const projectLines = lines.filter((l) => l.t === 'out' && /^\d\./.test(l.html));
    expect(projectLines).toHaveLength(5);
  });

  it('no incluye el sexto proyecto', () => {
    const { lines } = buildCommands(BASE).projects();
    const html = lines.map((l) => l.html).join(' ');
    expect(html).not.toContain('Proyecto F');
  });

  it('numera los proyectos desde 1', () => {
    const { lines } = buildCommands(BASE).projects();
    expect(lines[0].html).toMatch(/^1\./);
  });
});

describe('buildCommands — contact', () => {
  it('formatea los social links con label → value', () => {
    const { lines } = buildCommands(BASE).contact();
    expect(lines[0].html).toContain('github');
    expect(lines[0].html).toContain('github.com/ag');
  });
});

describe('buildCommands — neofetch', () => {
  it('retorna una line de tipo neofetch con data', () => {
    const { lines } = buildCommands(BASE).neofetch();
    expect(lines).toHaveLength(1);
    expect(lines[0].t).toBe('neofetch');
    expect(lines[0].data.os).toBe('macOS');
  });
});

describe('buildCommands — clear', () => {
  it('retorna { clear: true }', () => {
    expect(buildCommands(BASE).clear()).toEqual({ clear: true });
  });
});

describe('buildCommands — sudo hire', () => {
  it('retorna lines con el flujo de sudo', () => {
    const result = buildCommands(BASE)['sudo hire']();
    const html = result.lines.map((l) => l.html).join(' ');
    expect(html).toContain('recruiter');
    expect(html).toContain('contacto');
  });

  it('retorna una función then', () => {
    const result = buildCommands(BASE)['sudo hire']();
    expect(typeof result.then).toBe('function');
  });
});

describe('buildCommands — ls', () => {
  it('retorna las líneas estáticas del directorio', () => {
    const { lines } = buildCommands(BASE).ls();
    const html = lines.map((l) => l.html).join(' ');
    expect(html).toContain('projects/');
    expect(html).toContain('laboratorio/');
    expect(html).toContain('README.md');
  });
});

describe('buildCommands — cat readme.md', () => {
  it('divide el contenido por saltos de línea', () => {
    const { lines } = buildCommands(BASE)['cat readme.md']();
    expect(lines).toHaveLength(2);
    expect(lines[0].html).toContain('Línea 1');
    expect(lines[1].html).toContain('Línea 2');
  });

  it('muestra warning con readme vacío', () => {
    const { lines } = buildCommands({ ...BASE, readmeContent: '' })['cat readme.md']();
    const html = lines.map((l) => l.html).join('');
    expect(html).toContain('readme vacío');
  });
});

describe('buildCommands — date', () => {
  it('retorna la fecha como string no vacío', () => {
    const { lines } = buildCommands(BASE).date();
    expect(lines).toHaveLength(1);
    expect(lines[0].html.length).toBeGreaterThan(10);
  });
});

describe('buildCommands — echo', () => {
  it('repite los argumentos', () => {
    const { lines } = buildCommands(BASE).echo(['hola', 'mundo']);
    expect(lines[0].html).toBe('hola mundo');
  });

  it('escapa HTML en los argumentos', () => {
    const { lines } = buildCommands(BASE).echo(['<script>']);
    expect(lines[0].html).toBe('&lt;script&gt;');
  });

  it('sin argumentos retorna string vacío', () => {
    const { lines } = buildCommands(BASE).echo();
    expect(lines[0].html).toBe('');
  });
});
