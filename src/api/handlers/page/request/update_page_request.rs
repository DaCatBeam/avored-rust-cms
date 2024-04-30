use serde::Deserialize;

#[derive(Deserialize, Debug, Clone, Default)]
pub struct UpdatePageRequest {
    // #[validate(length(min = 1, message = "The name is a required field."))]
    pub name: String,

    // #[validate(length(min = 1, message = "The identifier is a required field."))]
    pub identifier: String,

    pub components_content: Vec<UpdatableComponentContentRequest>,
}


#[derive(Deserialize, Debug, Clone, Default)]
pub struct UpdatableComponentContentRequest {
    pub id: String,
    pub name: String,
    pub identifier: String,
    pub component_fields_content: Vec<UpdatableComponentFieldContentRequest>
}


#[derive(Deserialize, Debug, Clone, Default)]
pub struct UpdatableComponentFieldContentRequest {
    pub id: String,
    pub name: String,
    pub identifier: String,
    pub field_type: String,
    pub field_content: String,
}

// impl UpdatePageRequest {
//     pub fn validate_errors(&self) -> Result<ValidationErrors> {
//         let validation_error_list = match self.validate() {
//             Ok(_) => ValidationErrors::new(),
//             Err(errors) => errors,
//         };
//
//         for (_field_name, error) in validation_error_list.errors() {
//             match &error {
//                 ValidationErrorsKind::Field(field_errors) => {
//                     for _field_error in field_errors {
//                         // IDea here is to add it into some kind of Error Response
//                         // so we can return JSON struct with status code
//
//                         // let message = match &field_error.message {
//                         //     Some(message) => message,
//                         //     None => continue,
//                         // };
//                     }
//                 }
//                 ValidationErrorsKind::Struct(_) => continue,
//                 ValidationErrorsKind::List(_) => continue,
//             }
//         }
//
//         Ok(validation_error_list)
//     }
// }