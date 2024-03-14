import "./Home.css"
import { Api, BriefingState, BriefingType } from "../../utils/Api"
import { useEffect, useState } from "react"
import { Briefing } from "../Briefing/Briefing";
import Swal from 'sweetalert2'

import 'react-toastify/dist/ReactToastify.css';
import { EditModal } from "../EditModal/EditModal";

export const toggleExpandBriefing = (id : string) => {
    const element = document.getElementById(id)
    const button = element?.querySelector(".expand-button");
    if(element?.classList.contains("full-briefing")){
        element.classList.remove("full-briefing");
        if(button) button.innerHTML = "Expandir"
    }
    else{
        element?.classList.add("full-briefing");
        if(button) button.innerHTML = "Diminuir"
    }

    const descriptionElement = element?.querySelector(".description");
    if(descriptionElement?.classList.contains("full-description"))
        descriptionElement.classList.remove("full-description");
    else
        descriptionElement?.classList.add("full-description")

}


export function Home(){

    const [briefings, setBriefings] = useState<BriefingType[] | undefined>(undefined);
    const [createModal, setCreateModal] = useState<boolean>(false);

    const api : Api = new Api();

    useEffect(() => {
        loadBriefings();
    }, [])

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
                setCreateModal(false);
            }
            });
    }


    const loadBriefings = () => {

        try{
            api.getAll().then(response => {
                if(response.status == 200){
                    return response.json();
                }
            }).then((body : BriefingType[]) => {

                let briefingsRequest : BriefingType[] = body;
                let briefingsAprovados : BriefingType[] = [];
                let briefingsFinalizados : BriefingType[] = [];
                let briefingsNegociados : BriefingType[] = [];

                for(let brief of briefingsRequest){
                    if(brief.state == BriefingState.aprovado)
                        briefingsAprovados.push(brief);
                    else if(brief.state == BriefingState.finalizado)
                        briefingsFinalizados.push(brief)
                    else if(brief.state == BriefingState.negociacao)
                        briefingsNegociados.push(brief)
                }

                briefingsAprovados = briefingsAprovados.reverse()
                briefingsFinalizados = briefingsFinalizados.reverse()
                briefingsNegociados = briefingsNegociados.reverse()

                setBriefings(briefingsNegociados.concat(briefingsAprovados).concat(briefingsFinalizados))
            })
            .catch((err) => {
                console.error(err)
            })
        }
        catch(err){
            console.error(err);
        }

    }


    const handleSave = () => {
        loadBriefings()
    }

    const handleCreateButtonClick = () => {
        setCreateModal(true);
    }

    const handleCreateNewModal = (briefing? : BriefingType) => {
        if(!briefing){
            Swal.fire({
                title: "Houve um erro ao criar o briefing", 
                background: "var(--background-color)",
            })
            return;
        }

        try{
            api.create({
                clientName: briefing.client_name,
                description: briefing.description
            }).then((response) => {
                if(response.status == 200){
                    Swal.fire({
                        toast: true,
                        title: "Briefing criado com sucesso",
                        position: "top-end",
                        timer: 1500,
                        background: "var(--sombra-color)",
                        color: "var(--text-color)",
                        confirmButtonColor: "var(--accent-color)"
                    })
                    setCreateModal(false);
                    loadBriefings() ;
                }
                else{
                    Swal.fire({
                    title: "Houve um erro ao criar o briefing", 
                    background: "var(--background-color)",
                    })
                }
            })
            .catch((err) => {
                console.error(err)
            })
        }
        catch(err){
            console.log(err)
        }
    }


    const handleExpandAll = () => {

        briefings?.forEach(briefing => {
            toggleExpandBriefing(briefing.id)
        })

        const expandButton = document.getElementById("expand-all-button");

        if(!expandButton)
            return;

        expandButton.innerText = expandButton?.innerText == "Expandir todos" ? "Diminuir todos" : "Expandir todos";


    }

    return (

        <div className="home-page">

            <div className="title">
                Gestor de Briefings
            </div>

            <div className="buttons-container">
                <div className="create-button" onClick={handleCreateButtonClick}>
                    Adicionar briefing
                </div>
                <div className="create-button" id="expand-all-button" onClick={handleExpandAll}>
                    Expandir todos
                </div>
            </div>


            <div className="briefings-container">

                {
                    briefings != undefined && briefings.length > 0 ?
                    briefings?.map((b, key) => (
                        <Briefing briefing={b} key={key} whenSaved={handleSave}/>
                    ))
                    :
                    <p>Não há nenhum briefing cadastrado.</p>
                }

            </div>

            {
                createModal 
                ?
                    <EditModal 
                        title="Criar Briefing"
                        closeAction={() => {handleCancel()}}
                        saveAction={(briefing? : BriefingType) => {handleCreateNewModal(briefing)}}
                    />
                : 
                    <></>

            }



        </div>

    )

}