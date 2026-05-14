<script setup lang="ts">
import router from 'src/router';
import { computed, ref } from 'vue';
import FormSellerRegistration from 'src/components/form/FormSellerRegistration.vue';
import FormSellerLogin from 'src/components/form/FormSellerLogin.vue';

defineOptions({
  name: 'Index',
});

const showFormSellerRegistration = ref<boolean>(false);
const showFormSellerLogin = ref<boolean>(false);

const goLogin = () => {
  void router.push({ name: 'auth' });
};
const changeFormSellerRegistration = (): void => {
  showFormSellerRegistration.value = !showFormSellerRegistration.value;
};
const changeShowFormSellerLogin = (): void => {
  showFormSellerLogin.value = !showFormSellerLogin.value;
};

const listFeatures = computed(() => [
  {
    icon: 'trending_up',
    title: 'Gestão de Vendas',
    description:
      'Acompanhe vendas em tempo real, emita notas fiscais e analise desempenho com relatórios detalhados.',
  },
  {
    icon: 'inventory_2',
    title: 'Controle de Estoque',
    description: 'Gerencie inventário com precisão, receba alertas e evite perdas de produtos.',
  },
  {
    icon: 'analytics',
    title: 'Relatórios Inteligentes',
    description: 'Dashboards intuitivos e relatórios personalizáveis para decisões estratégicas.',
  },
]);
</script>

<template>
  <main class="landing-page">
    <header class="bg-white text-dark shadow-2">
      <q-toolbar class="header-toolbar">
        <q-toolbar-title class="q-ml-md">
          <div class="logo-text">
            <span class="text-primary text-weight-bold">
              Dalle <span class="text-grey-9">Manage</span>
            </span>
          </div>
        </q-toolbar-title>
        <q-space />
        <div class="row items-center q-gutter-md">
          <q-btn flat class="text-dark" label="Recursos" href="#features-section" />
          <q-btn flat class="text-dark" label="Depoimentos" href="#testimonials-section" />
          <q-btn flat class="text-dark" label="Preços" href="#pricing-section" />
          <q-btn-dropdown flat class="q-pa-none q-px-md q-mr-sm" ref="dropdown" label="Associado">
            <q-list>
              <q-item clickable v-close-popup @click="changeFormSellerRegistration">
                <q-item-section avatar>
                  <q-avatar>
                    <q-icon name="assignment_ind" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>Cadastrar</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="changeShowFormSellerLogin">
                <q-item-section avatar>
                  <q-avatar>
                    <q-icon name="person" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>Login</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
          <q-btn flat class="bg-primary text-white q-px-md" label="Entrar" @click="goLogin" />
        </div>
      </q-toolbar>
    </header>

    <section class="hero-section q-pa-xl bg-primary text-white">
      <div class="container text-center">
        <h1 class="text-h2 text-weight-bold q-mb-md">
          Gerencie suas Vendas e Estoque com Eficiência
        </h1>
        <p class="text-h6 q-mb-xl">
          Solução completa para otimizar a gestão do seu negócio. Simplifique processos, tome
          decisões inteligentes e impulsione seu crescimento.
        </p>
        <div class="q-gutter-md">
          <q-btn
            @click="goLogin"
            class="bg-dark text-white q-px-xl q-py-sm"
            label="Comece Grátis"
            size="lg"
          />
          <q-btn
            class="bg-white text-primary q-px-xl q-py-sm"
            outline
            label="Saber Mais"
            size="lg"
          />
        </div>
      </div>
    </section>

    <section id="features-section" class="features-section q-py-xl">
      <div class="container">
        <h2 class="text-h3 text-center text-dark q-mb-lg">Recursos que Fazem a Diferença</h2>
        <div class="row q-col-gutter-xl">
          <div
            v-for="(feature, index) in listFeatures"
            :key="index"
            class="col-xs-12 col-sm-6 col-md-4"
          >
            <q-card class="feature-card shadow-3 full-height">
              <q-card-section class="text-center q-pa-xl">
                <q-icon :name="feature.icon" size="xl" color="primary" class="q-mb-md" />
                <div class="text-h6 text-dark q-mb-sm">{{ feature.title }}</div>
                <p class="text-grey-7">{{ feature.description }}</p>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </section>

    <section
      id="testimonials-section"
      class="testimonials-section q-py-xl bg-dark text-white text-center"
    >
      <div class="container">
        <h2 class="text-h3 q-mb-lg">O que nossos Clientes Dizem</h2>
        <div class="row justify-center">
          <div class="col-xs-12 col-sm-10 col-md-8">
            <q-card class="testimonial-card bg-primary text-white q-pa-lg">
              <q-icon name="format_quote" size="lg" class="q-mb-md" />
              <p class="text-body1 q-mb-md">
                "O Dalle Manage transformou a forma como gerenciamos nosso negócio. A organização e
                os relatórios nos permitiram crescer 30% no último ano. É indispensável!"
              </p>
              <div class="text-subtitle1 text-weight-bold">- Maria Silva, Gerente de Vendas</div>
            </q-card>
          </div>
        </div>
      </div>
    </section>

    <section class="benefits-section q-py-xl bg-white text-dark">
      <div class="container text-center">
        <h2 class="text-h3 q-mb-lg">Mais do que um Software, uma Parceria para o Crescimento</h2>
        <div class="row q-col-gutter-xl justify-center">
          <div class="col-xs-12 col-sm-6 col-md-4">
            <div class="benefit-item q-pa-md">
              <q-icon name="schedule" size="xl" color="primary" class="q-mb-md" />
              <div class="text-h6 text-dark q-mb-sm">Otimize Seu Tempo</div>
              <p class="text-grey-8">
                Pare de perder horas em tarefas manuais e repetitivas. Automatize a gestão de
                estoque e vendas, liberando tempo para focar no que realmente importa: seu negócio.
              </p>
            </div>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-4">
            <div class="benefit-item q-pa-md">
              <q-icon name="trending_up" size="xl" color="primary" class="q-mb-md" />
              <div class="text-h6 text-dark q-mb-sm">Cresça Suas Vendas</div>
              <p class="text-grey-8">
                Com relatórios precisos, você identifica as melhores oportunidades de vendas e toma
                decisões estratégicas para impulsionar o faturamento.
              </p>
            </div>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-4">
            <div class="benefit-item q-pa-md">
              <q-icon name="savings" size="xl" color="primary" class="q-mb-md" />
              <div class="text-h6 text-dark q-mb-sm">Reduza Prejuízos</div>
              <p class="text-grey-8">
                Evite a perda de produtos com o controle de estoque em tempo real. Saiba exatamente
                o que vender e quando repor para maximizar seus lucros.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="pricing-section" class="pricing-section q-py-xl bg-grey-2">
      <div class="container text-center">
        <h2 class="text-h3 text-dark q-mb-lg">Escolha o Plano Ideal para o Seu Negócio</h2>
        <div class="row q-col-gutter-lg justify-center">
          <div class="col-xs-12 col-sm-6 col-md-4">
            <q-card class="pricing-card q-pa-lg">
              <div class="text-h5 text-dark q-mb-sm">Plano Básico</div>
              <div class="text-h3 text-primary q-mb-md">
                R$ 99<span class="text-subtitle1">/mês</span>
              </div>
              <q-separator inset class="q-my-md" />
              <q-list dense>
                <q-item
                  ><q-item-section avatar><q-icon name="check" color="green" /></q-item-section
                  ><q-item-section>Gestão de Vendas</q-item-section></q-item
                >
                <q-item
                  ><q-item-section avatar><q-icon name="check" color="green" /></q-item-section
                  ><q-item-section>Controle de Estoque</q-item-section></q-item
                >
                <q-item
                  ><q-item-section avatar><q-icon name="close" color="red" /></q-item-section
                  ><q-item-section>Relatórios Básicos</q-item-section></q-item
                >
              </q-list>
              <q-btn class="bg-primary text-white q-mt-md" label="Contratar" />
            </q-card>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-4">
            <q-card class="pricing-card q-pa-lg bg-primary text-white highlight-card shadow-10">
              <q-badge color="orange" floating class="q-ma-sm">Mais Popular</q-badge>
              <div class="text-h5 q-mb-sm text-white">Plano Pro</div>
              <div class="text-h3 q-mb-md">R$ 249<span class="text-subtitle1">/mês</span></div>
              <q-separator inset class="q-my-md" />
              <q-list dense>
                <q-item
                  ><q-item-section avatar><q-icon name="check" color="white" /></q-item-section
                  ><q-item-section>Gestão de Vendas Ilimitada</q-item-section></q-item
                >
                <q-item
                  ><q-item-section avatar><q-icon name="check" color="white" /></q-item-section
                  ><q-item-section>Controle de Estoque</q-item-section></q-item
                >
                <q-item
                  ><q-item-section avatar><q-icon name="check" color="white" /></q-item-section
                  ><q-item-section>Relatórios Avançados</q-item-section></q-item
                >
              </q-list>
              <q-btn class="bg-white text-primary q-mt-md" label="Contratar" />
            </q-card>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-4">
            <q-card class="pricing-card q-pa-lg">
              <div class="text-h5 text-dark q-mb-sm">Plano Empresarial</div>
              <div class="text-h3 text-primary q-mb-md">
                R$ 499<span class="text-subtitle1">/mês</span>
              </div>
              <q-separator inset class="q-my-md" />
              <q-list dense>
                <q-item
                  ><q-item-section avatar><q-icon name="check" color="green" /></q-item-section
                  ><q-item-section>Vendas e CRM</q-item-section></q-item
                >
                <q-item
                  ><q-item-section avatar><q-icon name="check" color="green" /></q-item-section
                  ><q-item-section>Controle de Estoque Avançado</q-item-section></q-item
                >
                <q-item
                  ><q-item-section avatar><q-icon name="check" color="green" /></q-item-section
                  ><q-item-section>Suporte Prioritário</q-item-section></q-item
                >
              </q-list>
              <q-btn class="bg-primary text-white q-mt-md" label="Contratar" />
            </q-card>
          </div>
        </div>
      </div>
    </section>

    <footer class="bg-dark text-white q-py-lg">
      <div class="container">
        <div class="row justify-between items-center q-col-gutter-lg">
          <div class="col-xs-12 col-md-4 text-center text-md-left">
            <div class="text-h6 text-primary q-mb-sm">Dalle Manage</div>
            <p class="text-subtitle2 q-mb-none">Soluções inteligentes para o seu negócio.</p>
          </div>
          <div class="col-xs-12 col-md-4 text-center">
            <div class="text-h6 text-primary q-mb-sm">Contato</div>
            <p class="q-mb-none">Email: contato@dallemanage.com.br</p>
            <p class="q-mb-none">Telefone: (11) 98765-4321</p>
          </div>
          <div class="col-xs-12 col-md-4 text-center text-md-right">
            <div class="text-h6 text-primary q-mb-sm">Nossas Redes</div>
            <div class="social-icons">
              <q-btn flat round dense icon="mdi-facebook" class="q-mr-sm" />
              <q-btn flat round dense icon="mdi-instagram" class="q-mr-sm" />
              <q-btn flat round dense icon="mdi-linkedin" />
            </div>
          </div>
        </div>
      </div>
    </footer>

    <!-- Modals -->
    <FormSellerRegistration
      :open="showFormSellerRegistration"
      @update:open="changeFormSellerRegistration()"
    />
    <FormSellerLogin :open="showFormSellerLogin" @update:open="changeShowFormSellerLogin" />
  </main>
</template>

<style scoped>
.landing-page {
  font-family: 'Roboto', sans-serif;
  overflow-x: hidden;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

.header-toolbar {
  max-width: 1200px;
  margin: 0 auto;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: bold;
}

.main-section {
  background:
    linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)),
    url('https://source.unsplash.com/random/1200x800?office,sales,startup') no-repeat center center;
  background-size: cover;
}

h1,
h2,
h3 {
  font-weight: 300;
}

.feature-card {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  border-radius: 10px;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.testimonial-card {
  border-radius: 10px;
  max-width: 700px;
  margin: 0 auto;
}

.social-icons .q-btn {
  font-size: 1.5rem;
  color: #fff;
}
</style>
