import { useState } from "react";
import { Api, BriefingState, BriefingType } from "../../utils/Api";

import "./Briefing.css"
import { EditModal } from "../EditModal/EditModal";
import Swal from "sweetalert2";
import DOMPurify from 'dompurify'
import { toggleExpandBriefing } from "../Home/Home";

export function Briefing(props : {briefing : BriefingType, whenSaved : (notify? : string) => void}){

    const [editModalId, setEditModalId] = useState<string | undefined>(undefined);

    let className : string = (
        props.briefing.state == "Negociação" ? "negociacao-shading" :
        props.briefing.state == "Finalizado" ? "finalizado-shading" :
        "aprovado-shading"
    )

    const api : Api = new Api();

    console.log(props)



    function edit(id : string){
        setEditModalId(id);
    }

    const  save = (briefing? : BriefingType) => {

        if(!briefing){
            Swal.fire({
                title: "Houve um erro ao editar o briefing", 
                background: "var(--background-color)",
            })
            return;
        }

        try{
            api.update(props.briefing.id, {
                clientName: briefing.client_name,
                description: briefing.description,
                state: briefing.state
            }).then(async (response) => {
                return {status : response.status, text: await response.text()}
            }).then((response) => {
                if(response.status == 200){
                    props.whenSaved();
                    Swal.fire({
                        toast: true,
                        title: "Briefing editado com sucesso",
                        position: "top-end",
                        timer: 1500,
                        background: "var(--sombra-color)",
                        color: "var(--text-color)",
                        confirmButtonColor: "var(--accent-color)"
                    })
                    setEditModalId(undefined);
                }
                else{
                    Swal.fire({
                    title: "Houve um erro ao editar o briefing", 
                    background: "var(--background-color)",
                    })
                }
            })
            .catch((err) => {
                console.error(err)
            })
        }
        catch(err){
            console.error(err);
        }

    }

    const handleDelete = () => {
        Swal.fire({
            title: "Deseja deletar este briefing?",
            text: "Não será possível recupera-lo depois",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sim",
            cancelButtonText: "Não",
            background: "var(--background-color)",
            color: "var(--text-color)"
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                title: "Apagado",
                text: "O briefing foi apagado.",
                icon: "success",
                background: "var(--background-color)",
                color: "var(--text-color)",
              });
              try{
                api.delete(props.briefing.id)
                .then(async (response) => {
                    return {status : response.status, text : await response.text()}
                })
                .then((response) => {
                    if(response.status == 200){
                        props.whenSaved(response.text);
                        setEditModalId(undefined)
                    }
                })
                .catch((err) => {
                    console.error(err)
                })

              }
              catch(err){
                console.error(err)
              }
            }
          });

    }

    const handleCancel = () => {
        Swal.fire({
            title: "Deseja cancelar edição?",
            text: "As alterações serão perdidas",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sim",
            cancelButtonText: "Não",
            background: "var(--background-color)",
            color: "var(--text-color)"
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                title: "Cancelada",
                text: "Sua edição foi cancelada.",
                icon: "success",
                background: "var(--background-color)",
                color: "var(--text-color)",
              });
              setEditModalId(undefined)
            }
          });
    }

    const handleChangeState = (state : BriefingState) => {

        if(!props.briefing)
            return;
        
        try{
            api.update(props.briefing.id, {
                state: state
            }).then(() => {
                props.whenSaved();
                const element = document.getElementById(props.briefing.id);
                const descriptionElement = element?.querySelector(".description");
                if(descriptionElement?.classList.contains("full-description"))
                    descriptionElement.classList.remove("full-description");
            })
            .catch((err) => {
                console.error(err)
            })
        }
        catch(err){
            console.error(err);
        }

    }

    const handlBriefExpand = () => {

        toggleExpandBriefing(props.briefing.id)

    }

    return (
        <div className={`briefing ${className}`} id={props.briefing.id}>
            <div className="user">
                <div className="user-icon">
                    <i className="bi bi-person-circle"></i>
                </div>
                <div className="user-name">
                    {props.briefing.client_name}
                </div>
                <div className="status-icon">
                    <i className={`bi ${
                        className == "negociacao-shading" ? "bi-pen" :
                        className == "finalizado-shading" ? "bi-check-all" :
                        "bi-check"
                    }`} id="icon-status">{props.briefing.state}</i>
                    <i className={`bi bi-pen-fill`} id="icon-status" onClick={() => edit(props.briefing.id)}>Editar</i>
                </div>
            </div>
            <div className="description-label">
                Descrição
                <div className="description" dangerouslySetInnerHTML={{__html : DOMPurify.sanitize(props.briefing.description.replace("\n", "<br>"))}}>
                </div>
            </div>
            <div className="delete change-state">
                {
                    props.briefing.state != "Finalizado" ? 
                        <div className="state-buttons">
                            Mudar estado para
                            <div 
                            onClick={() => handleChangeState(props.briefing.state == "Negociação" ? BriefingState.aprovado : BriefingState.finalizado)}
                            className={`state-button ${props.briefing.state.toLowerCase()}-button`}>
                                {
                                    props.briefing.state == "Negociação" ? "Aprovado" :
                                    props.briefing.state == "Aprovado" ? "Finalizado" : ""
                                }
                            </div>
                            {
                                props.briefing.state == "Aprovado" ? 
                                    <div 
                                    onClick={() => handleChangeState(BriefingState.negociacao)}
                                    className={`state-button ${props.briefing.state.toLowerCase()}-button`}>
                                        Negociacao
                                    </div>
                                : <></>
                            }
                        </div>
                    : <></>
                }
            </div>

            <div className="delete">
                <i className="bi bi-trash3-fill" onClick={handleDelete}></i>
                <div className="expand-button state-button" onClick={handlBriefExpand}>
                    Expandir
                </div>
            </div>

            {
                editModalId == undefined ? <></>
                : <EditModal briefingId={editModalId} 
                closeAction={handleCancel} 
                saveAction={(briefing? : BriefingType) => save(briefing)}
                />
            }
        </div>
    )
}