from django.shortcuts import render, redirect
from django.views.generic import TemplateView, CreateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views import View
from django.urls import reverse_lazy

from .models import CandidateProfile, EmployerProfile, User
from .forms import CandidateSignUpForm, EmployerSignUpForm

# essa é a view que apresenta a tela de boas-vindas
# e os botões para escolher o tipo de cadastro (candidato ou empregador)
class SignUpChoiceView(TemplateView):
    template_name = 'users/signup_choice.html'

#essa é a view que lida com o cadastro de usuários
# ela vai redirecionar para a view de cadastro de candidato ou empregador
class CandidateSignUpView(CreateView):
    model = User
    form_class = CandidateSignUpForm
    template_name = 'users/signup_form.html'
    success_url = reverse_lazy('login') # vai redirecionar para a tela de login após o sucesso

    # aqui estamos passando o tipo de usuário para o contexto
    # para que possamos exibir isso no template
    def get_context_data(self, **kwargs):
        kwargs['user_type'] = 'candidate'
        return super().get_context_data(**kwargs)

    # esse método é chamado quando o formulário é enviado e válido
    # aqui vamos salvar o usuário e criar o perfil de candidato associado
    def form_valid(self, form):
        user = form.save(commit=False)
        user.user_type = User.UserType.CANDIDATE
        user.set_password(form.cleaned_data['password']) # criptografa a senha
        user.save()

        # cria o perfil de candidato associado
        CandidateProfile.objects.create(
            user=user,
            birth_date=form.cleaned_data.get('birth_date'),
            phone_number=form.cleaned_data.get('phone_number'),
            cpf=form.cleaned_data.get('cpf'),
            cep=form.cleaned_data.get('cep'),
            resume=form.cleaned_data.get('resume')
        )
        
        return redirect(self.success_url)


# essa é a view que lida com o cadastro de empregadores
# ela tem o mesmo comportamento da view de cadastro de candidatos
# mas usa um formulário diferente e cria um perfil de empregador
class EmployerSignUpView(CreateView):
    model = User
    form_class = EmployerSignUpForm
    template_name = 'users/signup_form.html'
    success_url = reverse_lazy('login')

    def get_context_data(self, **kwargs):
        kwargs['user_type'] = 'employer'
        return super().get_context_data(**kwargs)

    def form_valid(self, form):
        user = form.save(commit=False)
        user.user_type = User.UserType.EMPLOYER
        user.set_password(form.cleaned_data['password'])
        user.save()

        # cria o perfil de empregador associado
        # pega o 'company_name' que adicionamos ao formulário
        EmployerProfile.objects.create(
            user=user,
            company_name=form.cleaned_data['company_name']
        )

        return redirect(self.success_url)

class DashboardRedirectView(LoginRequiredMixin, View):

    def get(self, request, *args, **kwargs):
        if request.user.user_type == User.UserType.CANDIDATE:
            return redirect('candidate_dashboard')
        elif request.user.user_type == User.UserType.EMPLOYER:
            return redirect('employer_dashboard')
        else:
            return redirect('login')


class CandidateDashboardView(LoginRequiredMixin, TemplateView):
    template_name = 'users/candidate/candidate_dashboard.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['profile'] = self.request.user.candidateprofile
        return context


class EmployerDashboardView(LoginRequiredMixin, TemplateView):
    template_name = 'users/employer/employer_dashboard.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['profile'] = self.request.user.employerprofile
        return context