import React from 'react';
import StepWizard from "react-step-wizard";
import {Button, Icon} from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import { Bounce } from 'react-reveal';
function ConfrimationPage() {
    const Percentage = (props) =>{
        return(<>
            <div className="progress" style={{height: "2px"}}>
                <div className="progress-bar bg-info" role="progressbar" style={{width: `${props.percentage}%`}} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
        </>)
    }
    const BottomNav = (props) =>{
        return(<>
                <div className='row'>
                        <div className='col-6 align-self-center text-start'> <Button onClick={props.previousStep}  className='rounded-pill bg-system-btn' size='tiny' ><Icon name='arrow left' />  </Button> </div>
                        <div className='col-6 align-self-center text-end'> <Button onClick={props.nextStep} className='rounded-pill bg-system-btn' size='tiny' > Suivant  <Icon name='arrow right ' /></Button> </div>
                </div>
            </>)
    }

    const One = (props) =>{
        const percentage = ((props.totalSteps - ( props.totalSteps - props.currentStep)) / props.totalSteps ) * 100 
        const Next = props.nextStep 
        const Previous = props.previousStep 
        return (<>
                <Percentage percentage={percentage} />
                <br />
                <div className='card card-body shadow-sm mb-4'>
                    <h3>La confirmation du compte vous permet d'obtenir un badge vert ( <span className='bi bi-patch-check-fill text-success'></span> ) indiquant que vous êtes le propriétaire officiel du compte </h3>

                    <h4 className='text-danger'>Vérification dans l'annuaire :</h4>
                    <p>Selectioner Votre Compte Dans L'annaire</p>
                    <BottomNav nextStep={Next} previousStep={Previous} />
                </div>     
       </>)
    }
    const Two = (props) =>{
        const percentage = ((props.totalSteps - ( props.totalSteps - props.currentStep)) / props.totalSteps ) * 100 
        const Next = props.nextStep 
        const Previous = props.previousStep 
        return (<>
                <Percentage percentage={percentage} />
                <br />
                <div className='card card-body shadow-sm mb-4'>
                        2
                    <BottomNav nextStep={Next} previousStep={Previous} />
                </div>
       </>)
    }
    const Three = (props) =>{
        const percentage = ((props.totalSteps - ( props.totalSteps - props.currentStep)) / props.totalSteps ) * 100 
        const Next = props.nextStep 
        const Previous = props.previousStep 
        return (<>
                <Percentage percentage={percentage} />
                <br />
                <div className='card card-body shadow-sm mb-4'>
                        3
                    <BottomNav nextStep={Next} previousStep={Previous} />
                </div>
       </>)
    }

    return ( <>
    <Bounce right>
        <div className="row justify-content-center">
            <div className="col-12 col-lg-9">
                <h4 className='mb-0'> <NavLink exact='true' to='/S/Parametre'> <span className='bi bi-arrow-left-circle-fill '></span></NavLink>  <b> Confirmer </b> </h4>
                <br />
                <br />
                <StepWizard isHashEnabled>
                        <One />
                        <Two />
                        <Three />
                </StepWizard>
            </div>
        </div>
    </Bounce>
    </> );
}

export default ConfrimationPage;