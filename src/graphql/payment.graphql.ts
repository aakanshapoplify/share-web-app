import { gql } from "@apollo/client";

export const SETUP_PAYMENT = gql`
  mutation SetupEventPayment ($selectedTicketInput: SelectedTicketInput) {
        setupEventPayment(selectedTicketInput: $selectedTicketInput) {
          client_secret
          payment_intent_id
          ephemeral_key
          is_free
        }
      }
`
export const JOIN_EVENT = gql`
  mutation JoinEvent ($selectedTicketInput: SelectedTicketInput) {
        joinEventStep3(selectedTicketInput: $selectedTicketInput) {
          event_id
          success
          questions {
            questionaire_id
            question
            responses {
              questionaire_response_id
              response
            }
          }
        }
      }
`