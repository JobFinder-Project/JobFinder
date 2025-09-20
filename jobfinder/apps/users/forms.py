from django import forms
import re
from datetime import datetime
from .models import User, CandidateProfile, EmployerProfile

class CandidateSignUpForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput(), label="Senha")

    birth_date = forms.DateField(
        label='Data de Nascimento',
        required=False,
        widget=forms.TextInput(attrs={'placeholder': 'DD/MM/AAAA'}),
        input_formats=['%d/%m/%Y', '%d%m%Y']
    )

    phone_number = forms.CharField(label='Número de Telefone', max_length=15, required=False)
    resume = forms.FileField(label='Currículo', required=False)
    cep = forms.CharField(label='CEP', max_length=10, required=False)
    cpf = forms.CharField(label='CPF', max_length=14, required=False)


    class Meta:
        model = User
        fields = ['first_name', 'last_name', 
                   'email', 'password']
    
    # tratamento dos campos para remover caracteres não numéricos
    def clean_cpf(self):
        cpf = self.cleaned_data.get('cpf')
        if cpf:
            return re.sub(r'\D', '', cpf)
        return cpf

    def clean_cep(self):
        cep = self.cleaned_data.get('cep')
        if cep:
            return re.sub(r'\D', '', cep)
        return cep

    def clean_phone_number(self):
        phone = self.cleaned_data.get('phone_number')
        if phone:
            return re.sub(r'\D', '', phone)
        return phone


class EmployerSignUpForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput(attrs={'autocomplete': 'new-password'}), label="Senha")
    company_name = forms.CharField(max_length=255, label="Nome da Empresa")
    cnpj = forms.CharField(max_length=18, label="CNPJ", required=False)
    website = forms.URLField(label="Website", required=False)
    phone_company = forms.CharField(max_length=15, label="Telefone da Empresa", required=False)

    def clean_cnpj(self):
        cnpj = self.cleaned_data.get('cnpj')
        if cnpj:
            return re.sub(r'\D', '', cnpj)
        return cnpj

    def clean_phone_company(self):
        phone_company = self.cleaned_data.get('phone_company')
        if phone_company:
            return re.sub(r'\D', '', phone_company)
        return phone_company

    class Meta:
        model = User
        fields = ['email', 'password']
