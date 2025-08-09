'use client'

import { useTranslations } from 'next-intl'
import { Locale } from '@/lib/i18n'
import { MapPin, Calendar, Brain, Coffee, Code, Heart, Github, Linkedin, Mail } from 'lucide-react'
import { Footer } from './Footer'
import Image from 'next/image';

interface AboutContentProps {
  locale: Locale
}

export function AboutContent({ locale }: AboutContentProps) {
  const t = useTranslations('about')

  const skills = [
    'Python', 'Java', 'FastAPI', 'Pytorch', 'Tensorflow', 'LangChain', 'LangFlow', 'MySQL',
    'PostgreSQL', 'Nginx', 'Docker', 'Docker-Compose', 'K8s'
  ]

  const interests = [
    { icon: Brain, label: locale === 'ko' ? 'LLM 기반 아키텍처' : 'LLM-based Architecture' },
    { icon: Coffee, label: locale === 'ko' ? '커피챗' : 'Coffee Chats' },
    { icon: Heart, label: locale === 'ko' ? '오픈소스' : 'Open Source' },
  ]

  return (
    <article className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="relative inline-block">
          <Image
            src="/images/avatar.png"
            alt="Avatar"
            width={128}
            height={128}
            className="rounded-full mb-6 mx-auto"
          />
        </div>
        <h1 className="text-4xl font-bold mb-4">
          {t('greeting')}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t('bio')}
        </p>
      </div>

      {/* Info Cards */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Personal Info */}
        <div className="bg-card rounded-xl p-6 border">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <MapPin className="mr-2 h-5 w-5" />
            {t('basicInfo')}
          </h2>
          <div className="space-y-3 text-muted-foreground">
            <div className="flex items-center">
              <MapPin className="mr-3 h-4 w-4" />
              <span>{locale === 'ko' ? '대전, 대한민국' : 'Daejeon, South Korea'}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="mr-3 h-4 w-4" />
              <span>{locale === 'ko' ? '2025년부터 엔지니어링 시작' : 'Engineering since 2025'}</span>
            </div>
            <div className="flex items-center">
              <Code className="mr-3 h-4 w-4" />
              <span>{locale === 'ko' ? 'AI 엔지니어' : 'AI Engineer'}</span>
            </div>
          </div>
        </div>

        {/* Interests */}
        <div className="bg-card rounded-xl p-6 border">
          <h2 className="text-2xl font-semibold mb-4">
            {t('interests')}
          </h2>
          <div className="space-y-3">
            {interests.map((interest, index) => (
              <div key={index} className="flex items-center text-muted-foreground">
                <interest.icon className="mr-3 h-4 w-4" />
                <span>{interest.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* About Content */}
      <div className="prose prose-lg dark:prose-invert mx-auto mb-12">
        {locale === 'ko' ? (
          <>
            <p>
              안녕하세요. 저는 AI Engineer를 꿈꾸는 고등학생 나병현입니다. 인공지능 기술을 통해 세상에 선한 영향력을 전달하고, 사람들의 삶을 더 나은 방향으로 바꾸는 일을 제 인생의 목표로 삼고 있습니다.
            </p>
            <br/>
            <p>
              현재 Python을 중심으로 Django, FastAPI와 같은 서버 프레임워크, TensorFlow, PyTorch와 같은 머신러닝/딥러닝 프레임워크 등을 학습하며 인공지능과 웹 백엔드 기술을 폭넓게 공부하고 있습니다.
              최근에는 LangChain, LangFlow와 같은 LLM 오케스트레이션 프레임워크에 많은 관심을 가지고 있으며, RAG, MLOps, LLMOps와 같은 LLM 기반 시스템 아키텍처 설계에도 많은 관심을 가지고 학습중입니다. 
              기술은 목적이 아니라 수단이며, 저는 본질적인 문제 해결에 집중하는 엔지니어가 되고자 합니다.
            </p>
            <br/>
            <p>
              이 블로그를 통해 엔지니어링하면서 배운 것들을 정리하고, 
              다른 분들과 지식을 나누고 싶습니다. 
              또한 저와 관련된 일상적인 이야기들도 함께 공유할 예정입니다.
            </p>
          </>
        ) : (
          <>
            <p>
              Hello, my name is Byeonghyeon Na, a high school student aspiring to become an AI Engineer. 
              My lifelong goal is to make a positive impact on the world through artificial intelligence and help improve people&apos;s lives in meaningful ways. 
            </p>
            <br/>
            <p>
                Currently, I am studying Python as my core language, along with server frameworks such as Django and FastAPI, and machine learning/deep learning frameworks like TensorFlow and PyTorch. 
                Recently, I&apos;ve developed a strong interest in LLM orchestration frameworks such as LangChain and LangFlow. I am also actively learning about LLM-based system architectures including RAG (Retrieval-Augmented Generation), MLOps, and LLMOps.
                My studies go beyond implementation—I place great emphasis on understanding the underlying structure of algorithms, data flow, and architecture design.
            </p>
            <br/>
            <p>
              Through this blog, I want to organize what I&apos;ve learned while engineering 
              and share knowledge with other people. 
              I also plan to share everyday stories.
            </p>
          </>
        )}
      </div>

      {/* Skills */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">
          {t('techStack')}
        </h2>
        <div className="flex flex-wrap gap-3">
          {skills.map((skill) => (
            <span
              key={skill}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-full text-sm font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="bg-muted rounded-xl p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">
          {t('contact')}
        </h2>
        <p className="text-muted-foreground mb-6">
          {locale === 'ko' 
            ? '프로젝트 협업이나 질문이 있으시면 언제든 연락해 주세요!'
            : 'Feel free to reach out for project collaborations or questions!'
          }
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <a
            href="https://github.com/iamb0ttle"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-background rounded-lg hover:bg-accent theme-transition"
          >
            <Github className="h-4 w-4" />
            <span>GitHub</span>
          </a>
          <a
            href="https://linkedin.com/in/your-profile"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-background rounded-lg hover:bg-accent theme-transition"
          >
            <Linkedin className="h-4 w-4" />
            <span>LinkedIn</span>
          </a>
          <a
            href="mailto:nbhyun0329@gmail.com"
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-background rounded-lg hover:bg-accent theme-transition"
          >
            <Mail className="h-4 w-4" />
            <span>Email</span>
          </a>
        </div>
      </div>
      
      <Footer locale={locale} />
    </article>
  )
}