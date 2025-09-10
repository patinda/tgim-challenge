type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          role: string
          avatar_url: string | null
          bio: string | null
          location: string | null
          company: string | null
          website: string | null
          social_links: Json
          expertise: string[]
          interests: string[]
          settings: Json
          is_onboarded: boolean
          online_at: string | null
          promotion_id: string | null
          project_info: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          role?: string
          avatar_url?: string | null
          bio?: string | null
          location?: string | null
          company?: string | null
          website?: string | null
          social_links?: Json
          expertise?: string[]
          interests?: string[]
          settings?: Json
          is_onboarded?: boolean
          online_at?: string | null
          promotion_id?: string | null
          project_info?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: string
          avatar_url?: string | null
          bio?: string | null
          location?: string | null
          company?: string | null
          website?: string | null
          social_links?: Json
          expertise?: string[]
          interests?: string[]
          settings?: Json
          is_onboarded?: boolean
          online_at?: string | null
          promotion_id?: string | null
          project_info?: Json
          updated_at?: string
        }
      }
      prompts: {
        Row: {
          id: string
          title: string
          description: string
          content: string
          category: string
          tags: string[] | null
          variables: string[] | null
          author_id: string
          usage_count: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          content: string
          category: string
          tags?: string[] | null
          variables?: string[] | null
          author_id: string
          usage_count?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          content?: string
          category?: string
          tags?: string[] | null
          variables?: string[] | null
          author_id?: string
          usage_count?: number | null
          updated_at?: string
        }
      }
      bibliography_references: {
        Row: {
          id: string
          title: string
          authors: string
          publisher: string
          publication_date: string
          category: string
          summary: string
          main_thesis: string
          strengths: string
          key_lessons: string
          quote: string | null
          cover_image: string | null
          external_link: string | null
          author_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          authors: string
          publisher: string
          publication_date: string
          category: string
          summary: string
          main_thesis: string
          strengths: string
          key_lessons: string
          quote?: string | null
          cover_image?: string | null
          external_link?: string | null
          author_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          authors?: string
          publisher?: string
          publication_date?: string
          category?: string
          summary?: string
          main_thesis?: string
          strengths?: string
          key_lessons?: string
          quote?: string | null
          cover_image?: string | null
          external_link?: string | null
          author_id?: string
          updated_at?: string
        }
      }
      user_reference_favorites: {
        Row: {
          user_id: string
          reference_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          reference_id: string
          created_at?: string
        }
        Update: {
          user_id?: string
          reference_id?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          type: string
          date: string
          start_time: string
          end_time: string
          description: string | null
          location: string
          platform: string | null
          meeting_link: string | null
          video_url: string | null
          month: string | null
          transcription: string | null
          resources: Json
          duration: string | null
          promotion_ids: string[]
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          type: string
          date: string
          start_time: string
          end_time: string
          description?: string | null
          location: string
          platform?: string | null
          meeting_link?: string | null
          video_url?: string | null
          month?: string | null
          transcription?: string | null
          resources?: Json
          duration?: string | null
          promotion_ids?: string[]
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          type?: string
          date?: string
          start_time?: string
          end_time?: string
          description?: string | null
          location?: string
          platform?: string | null
          meeting_link?: string | null
          video_url?: string | null
          month?: string | null
          transcription?: string | null
          resources?: Json
          duration?: string | null
          promotion_ids?: string[]
          created_by?: string
          updated_at?: string
        }
      }
      update_details: {
        Row: {
          id: string
          update_id: string | null
          title: string
          description: string
          module: string
          reported_by: string | null
          created_at: string
          status: string | null
        }
        Insert: {
          id?: string
          update_id?: string | null
          title: string
          description: string
          module: string
          reported_by?: string | null
          created_at?: string
          status?: string | null
        }
        Update: {
          id?: string
          update_id?: string | null
          title?: string
          description?: string
          module?: string
          reported_by?: string | null
          created_at?: string
          status?: string | null
        }
      }
      updates: {
        Row: {
          id: string
          title: string
          description: string
          type: string
          version: string
          date: string
          time: string | null
          suggested_by: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          type: string
          version: string
          date: string
          time?: string | null
          suggested_by?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          type?: string
          version?: string
          date?: string
          time?: string | null
          suggested_by?: string | null
          created_by?: string
          updated_at?: string
        }
      }
      feature_suggestions: {
        Row: {
          id: string
          title: string
          description: string
          module: string
          status: string
          suggested_by: string
          update_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          module: string
          status?: string
          suggested_by: string
          update_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          module?: string
          status?: string
          suggested_by?: string
          update_id?: string | null
          updated_at?: string
        }
      }
      intervenant_ratings: {
        Row: {
          id: string
          intervenant_id: string
          user_id: string
          rating: number
          comment: string | null
          criteria_ratings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          intervenant_id: string
          user_id: string
          rating: number
          comment?: string | null
          criteria_ratings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          intervenant_id?: string
          user_id?: string
          rating?: number
          comment?: string | null
          criteria_ratings?: Json
          updated_at?: string
        }
      }
      programs: {
        Row: {
          id: string
          title: string
          description: string
          thumbnail: string | null
          duration: string
          level: string
          status: string
          order: number | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          thumbnail?: string | null
          duration: string
          level: string
          status?: string
          order?: number | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          thumbnail?: string | null
          duration?: string
          level?: string
          status?: string
          order?: number | null
          created_by?: string
          updated_at?: string
        }
      }
      modules: {
        Row: {
          id: string
          program_id: string
          title: string
          description: string
          duration: string
          order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          program_id: string
          title: string
          description: string
          duration: string
          order: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          program_id?: string
          title?: string
          description?: string
          duration?: string
          order?: number
          updated_at?: string
        }
      }
      lessons: {
        Row: {
          id: string
          module_id: string
          title: string
          type: string
          duration: string
          content: string | null
          video_url: string | null
          transcription: string | null
          description: string | null
          order: number
          completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          module_id: string
          title: string
          type: string
          duration: string
          content?: string | null
          video_url?: string | null
          transcription?: string | null
          description?: string | null
          order: number
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          module_id?: string
          title?: string
          type?: string
          duration?: string
          content?: string | null
          video_url?: string | null
          transcription?: string | null
          description?: string | null
          order?: number
          completed?: boolean
          updated_at?: string
        }
      }
      resources: {
        Row: {
          id: string
          lesson_id: string
          title: string
          type: string
          url: string
          storage_path: string | null
          created_at: string
        }
        Insert: {
          id?: string
          lesson_id: string
          title: string
          type: string
          url: string
          storage_path?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          lesson_id?: string
          title?: string
          type?: string
          url?: string
          storage_path?: string | null
        }
      }
      quizzes: {
        Row: {
          id: string
          lesson_id: string
          title: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          lesson_id: string
          title: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          lesson_id?: string
          title?: string
          description?: string | null
          updated_at?: string
        }
      }
      questions: {
        Row: {
          id: string
          quiz_id: string
          text: string
          order: number
          created_at: string
        }
        Insert: {
          id?: string
          quiz_id: string
          text: string
          order: number
          created_at?: string
        }
        Update: {
          id?: string
          quiz_id?: string
          text?: string
          order?: number
        }
      }
      question_options: {
        Row: {
          id: string
          question_id: string
          text: string
          is_correct: boolean
          order: number
          created_at: string
        }
        Insert: {
          id?: string
          question_id: string
          text: string
          is_correct?: boolean
          order: number
          created_at?: string
        }
        Update: {
          id?: string
          question_id?: string
          text?: string
          is_correct?: boolean
          order?: number
        }
      }
      lesson_progress: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          lesson_id: string
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          lesson_id?: string
          completed?: boolean
          updated_at?: string
        }
      }
      salons: {
        Row: {
          id: string
          name: string
          description: string
          icon: string
          color: string
          created_by: string
          is_private: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          icon: string
          color: string
          created_by: string
          is_private?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          icon?: string
          color?: string
          created_by?: string
          is_private?: boolean | null
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          content: string
          author_id: string
          salon_id: string | null
          likes: number | null
          comments_count: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          content: string
          author_id: string
          salon_id?: string | null
          likes?: number | null
          comments_count?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          content?: string
          author_id?: string
          salon_id?: string | null
          likes?: number | null
          comments_count?: number | null
          updated_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          content: string
          post_id: string
          author_id: string
          parent_id: string | null
          likes: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          content: string
          post_id: string
          author_id: string
          parent_id?: string | null
          likes?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          content?: string
          post_id?: string
          author_id?: string
          parent_id?: string | null
          likes?: number | null
          updated_at?: string
        }
      }
      post_likes: {
        Row: {
          post_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          post_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          post_id?: string
          user_id?: string
        }
      }
      comment_likes: {
        Row: {
          comment_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          comment_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          comment_id?: string
          user_id?: string
        }
      }
      saved_posts: {
        Row: {
          post_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          post_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          post_id?: string
          user_id?: string
        }
      }
      feedback: {
        Row: {
          id: string
          user_id: string
          type: string
          rating: number
          content: string
          source_type: string
          source_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          rating: number
          content: string
          source_type: string
          source_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          rating?: number
          content?: string
          source_type?: string
          source_id?: string
        }
      }
      announcements: {
        Row: {
          id: string
          title: string
          content: string
          type: string
          pinned: boolean | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          type: string
          pinned?: boolean | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          type?: string
          pinned?: boolean | null
          created_by?: string
          updated_at?: string
        }
      }
      read_announcements: {
        Row: {
          user_id: string
          announcement_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          announcement_id: string
          created_at?: string
        }
        Update: {
          user_id?: string
          announcement_id?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string
          data: Json
          read: boolean | null
          link: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          message: string
          data?: Json
          read?: boolean | null
          link?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          message?: string
          data?: Json
          read?: boolean | null
          link?: string | null
        }
      }
      promotions: {
        Row: {
          id: string
          name: string
          description: string | null
          is_active: boolean | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          is_active?: boolean | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          is_active?: boolean | null
          created_by?: string
          updated_at?: string
        }
      }
      user_article_favorites: {
        Row: {
          user_id: string
          article_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          article_id: string
          created_at?: string
        }
        Update: {
          user_id?: string
          article_id?: string
        }
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          description: string
          points: number
          data: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          description: string
          points?: number
          data?: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          description?: string
          points?: number
          data?: Json
        }
      }
      user_progress: {
        Row: {
          user_id: string
          points: number
          level: number
          daily_actions: Json
          last_login: string | null
          updated_at: string
        }
        Insert: {
          user_id: string
          points?: number
          level?: number
          daily_actions?: Json
          last_login?: string | null
          updated_at?: string
        }
        Update: {
          user_id?: string
          points?: number
          level?: number
          daily_actions?: Json
          last_login?: string | null
          updated_at?: string
        }
      }
      articles: {
        Row: {
          id: string
          title: string
          content: string
          excerpt: string
          category: string
          tags: string[] | null
          cover_image: string | null
          external_url: string | null
          source: string | null
          content_type: string | null
          author_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          excerpt: string
          category: string
          tags?: string[] | null
          cover_image?: string | null
          external_url?: string | null
          source?: string | null
          content_type?: string | null
          author_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          excerpt?: string
          category?: string
          tags?: string[] | null
          cover_image?: string | null
          external_url?: string | null
          source?: string | null
          content_type?: string | null
          author_id?: string
          updated_at?: string
        }
      }
      deal_submissions: {
        Row: {
          id: string
          source: string | null
          internal_status: string | null
          owner_assigned: string | null
          admin_notes: string | null
          is_draft: boolean | null
          draft_session_id: string | null
          completion_percentage: number | null
          submitted_at: string | null
          last_name: string | null
          first_name: string | null
          email: string | null
          phone: string | null
          role_in_company: string | null
          ownership_pct: number | null
          legal_name: string | null
          trade_name: string | null
          siren: string | null
          naf_code: string | null
          legal_form: string | null
          foreign_company_id: string | null
          foreign_business_code: string | null
          foreign_legal_form: string | null
          incorporation_date: string | null
          hq_address: string | null
          region: string | null
          employees_fte: number | null
          management_team_stability: boolean | null
          turnover_yr_n: number | null
          turnover_yr_n1: number | null
          turnover_yr_n2: number | null
          ebitda_yr_n: number | null
          net_result_yr_n: number | null
          financial_debt: number | null
          cash_position: number | null
          accounting_firm: string | null
          audited_accounts: boolean | null
          activity_description: string | null
          value_proposition: string | null
          main_clients_share: number | null
          recurring_revenue_pct: number | null
          export_pct: number | null
          growth_drivers: string | null
          entry_barriers: string | null
          market_trends: string | null
          tangible_assets: string | null
          intangible_assets: string | null
          real_estate_owned: boolean | null
          erp_crm_stack: string | null
          it_dependencies: string | null
          ongoing_litigation: boolean | null
          regulatory_approvals: string | null
          social_risks: string | null
          environmental_risks: string | null
          deal_type: string | null
          asking_price: number | null
          valuation_basis: string | null
          preferred_acquirer: string[] | null
          sale_motivation: string | null
          handover_period: number | null
          timeline: string | null
          kbis_upload: Json | null
          financials_upload: Json | null
          org_chart_upload: Json | null
          leases_upload: Json | null
          ip_docs_upload: Json | null
          gdpr_consent: boolean | null
          nda_acknowledged: boolean | null
          website: string | null
          linkedin_company: string | null
          facebook: string | null
          instagram: string | null
          youtube: string | null
          twitter_x: string | null
          other_social: string | null
        }
        Insert: {
          id?: string
          source?: string | null
          internal_status?: string | null
          owner_assigned?: string | null
          admin_notes?: string | null
          is_draft?: boolean | null
          draft_session_id?: string | null
          completion_percentage?: number | null
          submitted_at?: string | null
          last_name?: string | null
          first_name?: string | null
          email?: string | null
          phone?: string | null
          role_in_company?: string | null
          ownership_pct?: number | null
          legal_name?: string | null
          trade_name?: string | null
          siren?: string | null
          naf_code?: string | null
          legal_form?: string | null
          foreign_company_id?: string | null
          foreign_business_code?: string | null
          foreign_legal_form?: string | null
          incorporation_date?: string | null
          hq_address?: string | null
          region?: string | null
          employees_fte?: number | null
          management_team_stability?: boolean | null
          turnover_yr_n?: number | null
          turnover_yr_n1?: number | null
          turnover_yr_n2?: number | null
          ebitda_yr_n?: number | null
          net_result_yr_n?: number | null
          financial_debt?: number | null
          cash_position?: number | null
          accounting_firm?: string | null
          audited_accounts?: boolean | null
          activity_description?: string | null
          value_proposition?: string | null
          main_clients_share?: number | null
          recurring_revenue_pct?: number | null
          export_pct?: number | null
          growth_drivers?: string | null
          entry_barriers?: string | null
          market_trends?: string | null
          tangible_assets?: string | null
          intangible_assets?: string | null
          real_estate_owned?: boolean | null
          erp_crm_stack?: string | null
          it_dependencies?: string | null
          ongoing_litigation?: boolean | null
          regulatory_approvals?: string | null
          social_risks?: string | null
          environmental_risks?: string | null
          deal_type?: string | null
          asking_price?: number | null
          valuation_basis?: string | null
          preferred_acquirer?: string[] | null
          sale_motivation?: string | null
          handover_period?: number | null
          timeline?: string | null
          kbis_upload?: Json | null
          financials_upload?: Json | null
          org_chart_upload?: Json | null
          leases_upload?: Json | null
          ip_docs_upload?: Json | null
          gdpr_consent?: boolean | null
          nda_acknowledged?: boolean | null
          website?: string | null
          linkedin_company?: string | null
          facebook?: string | null
          instagram?: string | null
          youtube?: string | null
          twitter_x?: string | null
          other_social?: string | null
        }
        Update: {
          id?: string
          source?: string | null
          internal_status?: string | null
          owner_assigned?: string | null
          admin_notes?: string | null
          is_draft?: boolean | null
          draft_session_id?: string | null
          completion_percentage?: number | null
          submitted_at?: string | null
          last_name?: string | null
          first_name?: string | null
          email?: string | null
          phone?: string | null
          role_in_company?: string | null
          ownership_pct?: number | null
          legal_name?: string | null
          trade_name?: string | null
          siren?: string | null
          naf_code?: string | null
          legal_form?: string | null
          foreign_company_id?: string | null
          foreign_business_code?: string | null
          foreign_legal_form?: string | null
          incorporation_date?: string | null
          hq_address?: string | null
          region?: string | null
          employees_fte?: number | null
          management_team_stability?: boolean | null
          turnover_yr_n?: number | null
          turnover_yr_n1?: number | null
          turnover_yr_n2?: number | null
          ebitda_yr_n?: number | null
          net_result_yr_n?: number | null
          financial_debt?: number | null
          cash_position?: number | null
          accounting_firm?: string | null
          audited_accounts?: boolean | null
          activity_description?: string | null
          value_proposition?: string | null
          main_clients_share?: number | null
          recurring_revenue_pct?: number | null
          export_pct?: number | null
          growth_drivers?: string | null
          entry_barriers?: string | null
          market_trends?: string | null
          tangible_assets?: string | null
          intangible_assets?: string | null
          real_estate_owned?: boolean | null
          erp_crm_stack?: string | null
          it_dependencies?: string | null
          ongoing_litigation?: boolean | null
          regulatory_approvals?: string | null
          social_risks?: string | null
          environmental_risks?: string | null
          deal_type?: string | null
          asking_price?: number | null
          valuation_basis?: string | null
          preferred_acquirer?: string[] | null
          sale_motivation?: string | null
          handover_period?: number | null
          timeline?: string | null
          kbis_upload?: Json | null
          financials_upload?: Json | null
          org_chart_upload?: Json | null
          leases_upload?: Json | null
          ip_docs_upload?: Json | null
          gdpr_consent?: boolean | null
          nda_acknowledged?: boolean | null
          website?: string | null
          linkedin_company?: string | null
          facebook?: string | null
          instagram?: string | null
          youtube?: string | null
          twitter_x?: string | null
          other_social?: string | null
        }
      }
      conversations: {
        Row: {
          id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          updated_at?: string
        }
      }
      conversation_participants: {
        Row: {
          conversation_id: string
          profile_id: string
          created_at: string
        }
        Insert: {
          conversation_id: string
          profile_id: string
          created_at?: string
        }
        Update: {
          conversation_id?: string
          profile_id?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string | null
          sender_id: string | null
          content: string
          read: boolean | null
          attachments: Json[] | null
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id?: string | null
          sender_id?: string | null
          content: string
          read?: boolean | null
          attachments?: Json[] | null
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string | null
          sender_id?: string | null
          content?: string
          read?: boolean | null
          attachments?: Json[] | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}